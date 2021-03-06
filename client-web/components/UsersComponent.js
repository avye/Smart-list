import React from 'react';
import { Component } from 'react';
import Form from '../containers/FormContainer.js';
import Table from '../components/TableComponent.js';

class UsersComponent extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){
    this.props.fetchUser();
  }

  render () {
    const { users, addUser, removeUser } = this.props;
    const fields = [
      'No.',
      'Username',
      'Email',
      'Admin',
      'Created At'
    ];
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h3>
              User List
            </h3>
          </div>
        </div>
        <Form onSubmit={addUser} fieldType="user"/>
        <Table
          items={users}
          fields={fields}
          type="users"
          clickHandler={removeUser}
        />
      </div>
    )
  }
}

export default UsersComponent;
