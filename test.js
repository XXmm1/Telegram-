import axios from 'axios';






axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://devapi.qweather.com/v7/weather/now?key=eab9afd48b9742f6a130f4ba3ed7b851&location=101010300',
    headers: { }
  })
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
