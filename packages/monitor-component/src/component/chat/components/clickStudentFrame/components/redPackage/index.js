import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import useSocketController from '../../../../../common/hooks/useSocketController';
import './index.less';
import PropsTypes from 'prop-types';
import { getRedPackageNum } from '../../../../api';
import { getRedpackageStatus } from '../../../../utils/index';

function RedPackage(props) {
  const [loading, setLoading] = useState(true);
  const [remainConin, setRemainConin] = useState(false);
  const [inputConin, setInputConin] = useState('');
  const [status, setStatus] = useState({ canUse: true, errTip: '' });

  const { hideFrame, lessonInfo } = props;

  // 监听课堂是否开始
  useSocketController('lessonStateChange', res => {
    if (res) {
      setStatus(getRedpackageStatus(lessonInfo));
    }
  });
  useEffect(() => {
    const init = async () => {
      const coinNum = await getRedPackageNum(); // 获取剩余红包数
      setRemainConin(coinNum);
      setLoading(false);
    };
    init();
    setStatus(getRedpackageStatus(lessonInfo));
  }, []);

  async function sendRedpackage() {
    await props.instance.senRedpackage(inputConin);
    hideFrame();
  }
  function handleInput(e) {
    setInputConin(e.target.value ? Math.min(e.target.value, remainConin) : '');
  }

  const { canUse, errTip } = status;
  return (
    <div className={'redPackage-kind'}>
      <p className={'kind'}>发红包</p>
      <div className={`${flex} ${'disable'}`}>
        {remainConin > 0 && canUse ? (
          <input
            placeholder={`彩虹币数量 ${remainConin} 以内`}
            value={inputConin}
            onChange={handleInput}
            type="number"
            onClick={e => {
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
        ) : (
          <div className={'disableSend'}>{!loading ? (errTip || '红包金额已使用完') : ''}</div>
        )}
        <button disabled={remainConin === 0 || !canUse || inputConin < 1} onClick={sendRedpackage}>
          发送
        </button>
      </div>
    </div>
  );
}
RedPackage.propTypes = {
  instance: PropsTypes.object,
  hideFrame: PropsTypes.func,
  lessonInfo: PropsTypes.object
};

export default connect(
  ({ lessonInfo }) => ({ lessonInfo }),
  () => ({})
)(RedPackage);