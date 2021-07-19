import React, { useState, useEffect, useContext } from 'react';
import { ControllerInstance } from '../../main';
import { getMin } from '../../utils/index';
import Panel from '../panel/index';
import Item from './item';
import './index.less';


export default function Detail() {
  const eventControllersInstance = useContext(ControllerInstance);
  const { redPackageController, praiseController } = eventControllersInstance.controllers;
  const [show, setShow] = useState(false);
  const [type, setType] = useState(false);
  const [time, setTime] = useState('');
  const [studentList, setStudentInfo] = useState(null);
  function cb(res) {
    const { data, ts } = res;
    setTime(getMin(ts));
    setShow(true);
    setStudentInfo(data || []);
  }
  useEffect(() => {
    redPackageController.on('getDetail', res => {
      setType('redPackage');
      cb(res);
    });
    praiseController.on('getDetail', res => {
      setType('praise');
      cb(res);
    });
  }, []);
  return (
    <Panel
      show= {show}
      header= {type === 'redPackage' ? '红包领取详情' : '老师表扬详情'}
      setShow={setShow}
    >
      { studentList && (
        <React.Fragment>
          <div className={'redPackAndPriseDetail-time'}>
            <span>{time}</span>
          </div>
          {studentList.length > 0 ? (
            <div className={'redPackAndPriseDetail-content'}>
              {studentList.map((i, index) => (
                <Item key={index} data={i} type={type} />
              ))}
            </div>
          ) : (
            <div className={'redPackAndPriseDetail-noUser'}>暂无人领取</div>
          )}
        </React.Fragment>
      )}
    </Panel>
  );
}
