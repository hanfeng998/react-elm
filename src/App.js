import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Loading from "./components/common/loading/loading";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

const customHistory = createBrowserHistory();
const App = () => (
  <Router history={customHistory}>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/city/:id" component={City} />
      <Route path="/msite" component={posMsite} />
      <Route path="/food" component={FoodContainer} />
      <Route path="/shop" component={ShopContainer} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/search/:geoHash" component={Search} />
    </div>
  </Router>
);

function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }
    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return <Loading />;
    }
  };
}

const Home = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./pages/home/home").default);
  }));
const City = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./pages/city/city").default);
  }));
const posMsite = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./store/container/msite").default);
  }));
const FoodContainer = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./store/container/food").default);
  }));
const ShopContainer = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./store/container/shop").default);
  }));
const Profile = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./pages/profile/profile").default);
  }));
const Login = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./pages/login/login").default);
  }));
const Search = asyncComponent(cb =>
  require.ensure([], require => {
    cb(require("./pages/search/search").default);
  }));
export default App;
