import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';
export default class Unread extends PureComponent {

  constructor(props) {
    super(props);
    this.changeUnreadNum = this.changeUnreadNum.bind(this);
    this.state = {
      unReadNum: 0,
      isStudent: props.userInfo.role === 'STUDENT'
    };
  }
  changeUnreadNum(num) {
    this.setState({
      unReadNum: num
    });
  }

  render() {
    const { show, scrollToBottom } = this.props;
    const { unReadNum, isStudent } = this.state;
    return (
      <div className={'noread'} style={{ display: show && unReadNum > 0 ? 'block' : 'none', bottom: isStudent ? '140px' : '140px' }} onClick={() => scrollToBottom()}>
        {unReadNum}
      </div>
    );
  }
}
Unread.propTypes = {
  show: PropTypes.bool,
  scrollToBottom: PropTypes.func,
  userInfo: PropTypes.object
};