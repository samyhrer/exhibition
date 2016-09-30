import React from 'react';
import {
  FormattedMessage
} from 'react-intl';
import Helmet from 'react-helmet';
import './style.scss';

class Frontpage extends React.Component {
  renderMsg() {
    return (
      <FormattedMessage
        id="HELLO_WORLD"
        description="Greeting to welcome the user to the app"
        defaultMessage="default"
      />
    );
  }

  render() {
    return (
      <div className="frontpage">
        <Helmet title="Forsiden" />
        { this.renderMsg() }
      </div>
    );
  }
}

export default Frontpage;
