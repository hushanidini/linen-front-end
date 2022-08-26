import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import publicRoute from "../routes/publicRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import privateRoute from "../routes/privateRoute";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import '../theme/app.css';
import '../theme/calendar.css';
import '../theme/css/style.css';
// import '../theme/css/media.css';
// import '../theme/css/stepform.css';
import '../theme/scss/style.scss';
import {Redirect} from "react-router";
import commonRoute from "../routes/commonRoute";
// import '../theme/scss/media.scss';
// import '../theme/scss/stepform.scss';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/',
        };
    }

    NoMatch = () => {
        return (
            <div>
                <h3>URL not found!!</h3>
            </div>
        );
    };
    publicRoute = (route, index) => {
        const {auth} = this.props;
        if (auth) {
            return;
        }
        return (
            <Route
                key={index}
                path={route.path}
                component={route.component}
                exact={route.exact}
            />
        );
    };

    commonRoute  = (route, index) => {
        return (
            <Route
                key={index}
                path={route.path}
                component={route.component}
                exact={route.exact}
            />
        );
    }

    privateRoute = (route, index) => {
        const {auth} = this.props;
        if (!auth) {
            return;
        }
        return (
            <Route
                key={index}
                path={route.path}
                component={route.component}
                exact={route.exact}
            />
        );
    };

    componentDidMount() {
        const wHeight = window.innerHeight;
        this.setState({path: window.location.pathname, scrollBar: wHeight});
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {privateRoute.map((route, index) => this.privateRoute(route, index))}
                    {commonRoute.map((route, index)  => this.commonRoute(route, index))}
                    {publicRoute.map((route, index)  => this.publicRoute(route, index))}
                    <Route path="*">
                        <Redirect to={{pathname: '/'}}/>
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    const {auth} = state;
    return {auth};
}
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
