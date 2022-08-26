import React , {Component} from 'react';

class Footer extends Component{
    render() {
        return(
                <footer className="page-footer font-small teal pt-4" style={{paddingLeft:'250px',paddingRight:'250px'}}>

                    <div className="footer-copyright text-center py-3 row">
                        <div className="col-md-6 col-sm-6 col-lg-6">© 2020 Linen and Love Studio. All rights reserved</div>
                        <div className="col-md-6 col-sm-6 col-lg-6">Deposits & Cancellation | Policies, Rules & Guidelines</div>
                    </div>

                </footer>
        );
    }
}
export default Footer;
