import React from "react";
import { Header } from "../components/header";

const FourOhFourPage: React.FC = () => {
    return <>
        <Header></Header>
        <div className="page">
            <h2>Oops! Page not found</h2>
        </div>
    </>

}

export { FourOhFourPage };