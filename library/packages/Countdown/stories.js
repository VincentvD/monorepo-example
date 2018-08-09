import React from 'react'
import { storiesOf } from '@storybook/react'
import Countdown from '.'

storiesOf('Countdown', module)
  .add('with standard setting', () => <Countdown />)
  .add('with a custom countStart setting', () => <Countdown countStart="10" />)
