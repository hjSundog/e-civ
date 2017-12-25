import React, { Component } from "react";
import { withRouter } from "react-router-dom";

const validate = function(history) {
    const user = window.localStorage.getItem("user");
    const isLoggedIn = !!user;
    if (!isLoggedIn && history.location.pathname != "/login") {
        history.replace("/login");
    }
    if(isLoggedIn && !JSON.parse(window.localStorage.getItem('user')).person_id) {
        history.replace('/charactor');
    }
};

/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function authHOC(BaseComponent) {
    class Restricted extends Component {
        componentWillMount() {
            this.checkAuthentication(this.props);
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.location !== this.props.location) {
                this.checkAuthentication(nextProps);
            }
        }
        checkAuthentication(params) {
            const { history } = params;
            validate(history);
        }
        render() {
            return <BaseComponent {...this.props} />;
        }
    }
    return withRouter(Restricted);
}
