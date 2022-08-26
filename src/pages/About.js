import React , {Component} from 'react';
import AboutDialog from '../components/core/CustomDialog'


class About extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        }
    }
    openDialog=()=>{
        this.setState({isOpen:!this.state.isOpen})
    }

    render() {
    const {isOpen} = this.state;

        return (
            <div>About component
                <br/>
            <button onClick={this.openDialog} >open</button>
                {isOpen && (
                    <AboutDialog isNoteOpen={isOpen}
                                 closeDialog={()=>this.setState({isOpen: false})}>
                        content here
                    </AboutDialog>
                )}

                <br/>

        </div>
        )
    }
}
export default About;
