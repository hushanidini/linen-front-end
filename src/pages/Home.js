import React, {Component} from 'react';
import Christmas from '../assets/Christmas-1.jpg'
import Bmage1 from '../assets/bg1.png'
import PublicRootElement from "./admin/component/PublicRootElement";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    container: {
        padding: 0,
        width: '90%',
        maxWidth: '1160px',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
class Home extends Component {


    render() {
        const {classes}=this.props;
        return (
            <PublicRootElement>
                <div className ={classes.container}>
                    <div className="components row" style={{paddingLeft:'250px',paddingRight:'250px' , marginTop:'20px',margin: 0}}>
                        <div className="col-md-12 col-sm-12 col-lg-6" >
                            {/*<img src={Logo} alt={'Logo'}/>*/}
                        </div>
                        {/*<div className="col-md-12 col-sm-12 col-lg-6" >*/}
                            {/*<button style={{float: 'center'}}>select</button>*/}
                        {/*</div>*/}
                    </div>
                    <div style={{    verticalAlign: 'middle'}}>
                        <img src={Christmas} alt={'Christmas'} width='100%!important' />
                    </div>
                    <div className="container">
                        <br/>
                        <h1 style={{textAlign:'center' , color:'#717171'}} ><strong>About</strong> Linen and Love Studios</h1>
                        <p style={{textAlign:'center' ,color:'#717171'}}>We are a brand new luxury portrait studio with 3 unique rooms. Our studio is very conveniently located near the intersection of highways 407 and 404 with lots of free, private parking right out front. Each of our beautiful new studio rooms have a unique design with lots of thoughtful details that are complemented with hand-selected, luxury designer furniture and accents. This makes our space perfect for everything from family portraits or wedding photos to fashion and editorial work. We have plenty of large windows that fill the rooms with gorgeous natural light and 20-foot-high ceilings make the rooms look and feel spacious and airy. Guests can also request access to our dressing parlour with professional lighting and seating to allow for quick and convenient touch ups and make and hairstyle changes. We are looking forward to our guests creating some beautiful memories in our space and we couldn’t be more excited to be a part of your stories.</p>
                    </div>

                    <div className="container">
                        <div className="studios-wrapper">
                            <div className="studio-wrapper">
                                <div className="content">
                                    <h2>
                                        Willow
                                        <span className="studio-text">Studio</span>
                                    </h2>
                                    <p>
                                        The Willow is light and airy.
                                    </p>
                                    <div>
                                        <a href={true} className="check-studio-av-btn js-check-studio-av-btn d-inline-block mr-3 w-100">Check
                                            Availability</a>
                                        <a href="https://linenandlovestudios.com/willow/book-willow"
                                           className="check-studio-av-btn js-check-studio-av-btn d-inline-block w-100"
                                           style={{maxWidth: '75px'}}>Details</a>
                                    </div>

                                </div>
                                <div className="img-wrapper">
                                    <div className="img-bg"
                                         style={{backgroundImage: 'url(https://linenandlovestudios.com/wp-content/uploads/2019/12/ballroom-studio-hero.jpg)'}}>
                                    </div>

                                    <img src={Bmage1}
                                         className="img-fluid" alt={'Bmage1'}/>
                                </div>
                            </div>
                            <div className="studio-wrapper">
                                <div className="content">
                                    <h2>
                                        Birch
                                        <span className="studio-text">Studio</span>
                                    </h2>
                                    <p>
                                        Birch is dreamy and elegant.
                                    </p>
                                    <div>
                                        <a href="https://linenandlovestudios.com/birch/book-birch#booking-app"
                                           className="check-studio-av-btn js-check-studio-av-btn d-inline-block mr-3 w-100">Check
                                            Availability</a><a href="https://linenandlovestudios.com/birch/book-birch"
                                                               className="check-studio-av-btn js-check-studio-av-btn d-inline-block w-100"
                                                               style={{maxWidth: '75px'}}>Details</a>
                                    </div>
                                </div>
                                <a href="https://linenandlovestudios.com/birch/book-birch"
                                   className="check-studio-av-btn js-check-studio-av-btn">
                                    <div className="img-wrapper">
                                        <div className="img-bg"
                                             style={{backgroundImage: 'url(https://linenandlovestudios.com/wp-content/uploads/2020/10/birch_home-1024x276-1.png)'}}>
                                        </div>
                                        <img src={Bmage1}
                                             className="img-fluid" alt={'Bmage1'}/>
                                    </div>
                                </a>
                            </div>
                            <div className="studio-wrapper">
                                <div className="content">
                                    <h2>
                                        Fern
                                        <span className="studio-text">Studio</span>
                                    </h2>
                                    <p>
                                        Tropical Loft room offers a brick wall, a balcony and lots of tropical accents.
                                    </p>
                                    <div>
                                        <a href="https://linenandlovestudios.com/fern/book-fern#booking-app"
                                           className="check-studio-av-btn js-check-studio-av-btn  d-inline-block mr-3 w-100">Check
                                            Availability</a><a href="https://linenandlovestudios.com/fern/book-fern"
                                                               className="check-studio-av-btn js-check-studio-av-btn d-inline-block w-100"
                                                               style={{maxWidth: '75px'}}>Details</a>
                                    </div>


                                </div>
                                <a href="https://linenandlovestudios.com/fern/book-fern"
                                   className="check-studio-av-btn js-check-studio-av-btn">
                                    <div className="img-wrapper">
                                        <div className="img-bg"
                                             style={{backgroundImage: 'url(https://linenandlovestudios.com/wp-content/uploads/2020/01/fern_home.png)'}}>
                                        </div>
                                        <img src={Bmage1}
                                             className="img-fluid" alt={'Bmage1'}/>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicRootElement>

        );
    }
}

export default withStyles(styles)(Home);
