import React from 'react';
import PropTypes from 'prop-types';

export default class Countdown extends React.Component {
  state = {
    count: this.props.countStart
  };

  componentWillMount() {
    if (this.props.countStart === 0 && this.props.onComplete) {
      this.props.onComplete();
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  tick() {
    const { count } = this.state;
    const { onComplete } = this.props;

    const newCount = count - 1;

    if (newCount <= 0) {
      clearInterval(this.intervalId);

      if (onComplete) {
        this.props.onComplete();
      }
    }

    this.setState({ count: (newCount >= 0 ? newCount : 0) });
  }

  render() {
    return <span>{this.state.count}</span>;
  }
}

Countdown.propTypes = {
  countStart: PropTypes.number,
  onComplete: PropTypes.func
};

Countdown.defaultProps = {
  onComplete: undefined,
  countStart: 3
};
