import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { EventCard, Layout } from '../components'

@connect(({ app }) => ({ ...app }))
class Invitation extends Component {
  static navigationOptions = {
    title: 'Invitation',
  }

  render() {
    const events = [
      {
        user: 'Ace Lumaad',
        title: 'Chill at Tamper',
        description: 'Come guys! lets go to Tamper! it is really cool there.',
        location: 'Tamper Coffee & Brunch',
        date: 'May 28, 2018',
      },
      {
        user: 'John Bill Suarez',
        title: 'Frisbee Time!',
        description: 'Play frisbee at Grand Stand!',
        location:
          'C.P.G. Sports Complex Grandstand, M Torralba Street, Tagbilaran City, Bohol',
        date: 'May 30, 2018',
      },
      {
        user: 'Gemin Drigon',
        title: 'Software Developer Meetup',
        description:
          'We really need to meetup guys, we need to discuss the situation',
        location: 'Tamper Coffee & Brunch',
        date: 'July 14, 2018',
      },
      {
        user: 'Andrew Anderson',
        title: 'Spongecola at Bohol',
        description: 'Watch Spongecola Show',
        location: 'City Square Parking Lot, Tagbilaran City, Bohol',
        date: 'July 19, 2018',
      },
    ]

    return (
      <Layout>
        {_.map(events, (item, i) => (
          <EventCard
            key={i}
            item={item}
          />
        ))}
      </Layout>
    )
  }
}

export default Invitation
