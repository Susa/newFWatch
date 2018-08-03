import React, { Component } from 'react'

import { Layout } from '../../components'

class SearchPlaces extends Component {
  static navigationOptions = {
    title: 'Login',
  }

  onWrapTouchStart = (e) => {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <Layout>

      </Layout>
    )
  }
}

export default SearchPlaces
