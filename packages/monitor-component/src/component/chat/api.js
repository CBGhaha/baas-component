// import request from '../common/utils/';
// import eventControllersInstance from '../common/services/socket/index';

// export async function getRedPackageNum() {
//   try {
//     const res = await eventControllersInstance.send('red_packet_state');
//     const { data: [pageNum, coinNum] } = res;

//     if (pageNum > 0 && coinNum > 0) {
//       return coinNum;
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return 0;
// }

export const getConfig = (eventControllersInstance) => {
  return eventControllersInstance.send('getConfig');
};