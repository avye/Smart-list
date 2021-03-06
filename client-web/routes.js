import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import CoreLayout from './components/CoreLayout';
import Users from './containers/UsersContainer.js';
import Items from './containers/ItemsContainer.js';
// import ManageListings from './containers/ManageListingsContainer';
// import Login from './containers/LoginContainer';
// import Signup from './containers/SignupContainer.js';
// import ItemDetail from './containers/ItemDetailContainer';
// import Profile from './containers/ProfileContainer';

export default (
  <Route path="/" component={CoreLayout}>
    <IndexRedirect to="/user" />
    <Route path="/user" component={Users} />
    <Route path="/item" component={Items} />
    {/*<Route path="test" component={Users} />*/}
  </Route>
);


{/*<Route path="listings" component={Listings} />
<Route path="manage" component={ManageListings} />
<Route path="login" component={Login} />
<Route path="signup" component={Signup} />
<Route path="profile" component={Profile} />*/}
