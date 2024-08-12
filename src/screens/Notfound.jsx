import React from 'react'
import Footer from './Footer'
import { NavLink } from 'react-router-dom'
import NavContainer from './home/NavContainer'

const Notfound = () => {
    return (
        <>
            <NavContainer />
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="col-sm-12  text-center">
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center ">404</h1>

                                </div>

                                <div className="contant_box_404">
                                    <h3 className="h2">
                                        Look like you're lost
                                    </h3>

                                    <p>the page you are looking for not avaible!</p>
                                    <NavLink to='/' className="btn btn-orange rounded-pill wow bounceIn">Go to Home</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-footer">
                <Footer />
            </div>
        </>
    )
}

export default Notfound