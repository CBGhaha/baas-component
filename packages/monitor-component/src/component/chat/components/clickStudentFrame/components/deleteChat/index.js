import React, { useState, useEffect } from 'react';
import './index.less';
import PropsTypes from 'prop-types';
import ZmIcon from '../../../../../common/components/zmIcon';
import Modal from '../../../../../common/components/modal/index';

let hasConfirm = false;
export default function DeleteChat(props) {
  const { instance, updateDataList, hideFrame } = props;
  const [show, setShow] = useState(false);
  // 删除某条消息
  async function deleteChat() {
    setShow(false);
    if (!instance.isDeleted) {
      await props.instance.deleteChat();
      updateDataList();
      hideFrame();
    }
  }
  function handleDelete(e) {
    if (hasConfirm) {
      deleteChat();
    } else {
      e.nativeEvent.stopImmediatePropagation();
      setShow(true);
    }
  }
  function handleCancel() {
    hasConfirm = true;
    deleteChat();
  }
  useEffect(()=>{
    const hide = ()=>{ setShow(false);};
    window.addEventListener('blur', hide);
    return ()=>window.removeEventListener('blur', hide);
  }, []);
  return (
    <div className={'deleteChat-flex'}>
      <Modal className={'modal'} show={show} conform={{ txt: '好的', cb: deleteChat }} cancel={{ txt: '不再提示', cb: handleCancel }} title="删除操作不可逆，老师请慎重~" onClose={()=>{setShow(false);}}/>
      <span className={'kind'}>删除该条发言</span>
      <button onClick={handleDelete}>
        <ZmIcon className={`${'deleteIcon'} ${instance.removed ? 'deleted' : ''}`} icon="icon-delete"/>
      </button>
    </div>
  );

}
DeleteChat.propTypes = {
  instance: PropsTypes.object,
  updateDataList: PropsTypes.func,
  hideFrame: PropsTypes.func
};