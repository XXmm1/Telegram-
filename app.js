import TelegramBot from "node-telegram-bot-api";
import axios from 'axios';
import url from "url" //获取模块

const  hefeng_key ='eab9afd48b9742f6a130f4ba3ed7b851'  //调用的API key
const bot_token = '7180058636:AAH1q9rfMiGU8OUGSwbohbgzXv20Y3-NHqI'


const bot=new TelegramBot(bot_token,{
    polling:true //请求最新的数据 轮询请求信息

}) //实例化 常量 保存机器人API 令牌


//异步调用 async 设置为异步函数,await 用来等待返回值,如果直接跳过的话，返回值会是一个promise

 bot.onText(/^天气/,msg=>{
       let local = msg.text.split(" ")[1]
       Weather(local,msg.from.id)
       .catch(err=>{
        console.log(err)
       })
 })


bot.on('message', async msg=>{
    // console.log(msg);//监听消息
 

})


bot.on('callback_query',async query=>{
         console.log(query);
         const {data,from}= query
         if(data && typeof data ==='string'){
          let cmd = data.split("_");
           if(cmd){
           switch (cmd[0]) {
            case 'weather':
                let weather = await getWeather(cmd[1]);
                bot.sendMessage(from.id,`
                ${cmd[2]}
                当前的天气是${weather.text}
                温度是:${weather.temp}℃
                体感温度:${weather.feelsLike}℃
                风向:${weather.windDir}
                `)
                break;
           
            default:
                break;
           }

           }//1
        }
})


//找位置ID
function findLocationId(text) {
      const api = new url.URL('https://geoapi.qweather.com/v2/city/lookup')
      api.searchParams.append('key',hefeng_key);
      api.searchParams.append('location',text);
     return axios.get(api.href).then(res=>{
         console.log(res.data);
         if(res.data.code ==='200'){
            return res.data.location
         }else{
            return null;
         }
      })
      .catch(err=>{
          console.log("发生了一个Bug",err)
          return null;
      })
}


//找天气
function getWeather(location){
    const api = new url.URL('https://devapi.qweather.com/v7/weather/now')
    api.searchParams.append('key',hefeng_key);
    api.searchParams.append('location',location);
    return axios.get(api.href).then(res=>{
        console.log(res.data);
        if(res.data.code ==='200'){
           return res.data.now
        }else{
           return null;
        }
     })
     .catch(err=>{
         console.log("发生了一个Bug",err)
         return null;
     })



}


async function  Weather(text,id){
    let list = await findLocationId(text)
    if(list){
        if(list.length > 1){
          
            //返回很多数组的话，要根据这些数组的数量来创建新的数组
            let an_jian=[];//声明一个空的数据用户存放收到的数据
            let row =[];
             for(let i =0;i<list.length;i++){ //限制每一行只出现2个按钮
                  row.push({
                    text : list[i].adm1+list[i].adm2+list[i].name,
                    callback_data : 'weather_'+list[i].id + `_${list[i].name}`
                  })
                  if(i!== list.length-1){
    
                  if(row.length === 2 ){
                        an_jian.push(row)
                        row=[];
                      }
    
                  }else{
                       an_jian.push(row)
                  }
             }       
     
             //弹出一些供选择的按钮
                bot.sendMessage(id,'有一些相似的地址,请选择你所在的位置:',{reply_markup : {
                inline_keyboard : an_jian
                
             }})
    
    
        }else{
            //如果里面有数据 而且只有一个list数组的数据，那就直接返回这个信息给用户  
            let weather = await getWeather(list[0].id);
            bot.sendMessage(id,`
            ${list[0].name}
            当前的天气是${weather.text}
            温度是:${weather.temp}℃
            体感温度:${weather.feelsLike}℃
            风向:${weather.windDir}
            `)
      
           }
         } else{
             bot.sendMessage(id,'没有找到你需要的地址!')
    
         }


}
