// LV1：修改老師的 Codepen，接 API 顯示 Donut 圖
// LV2：依照此 XD 設計稿，用 axios 介接資料，並顯示 C3 圖表
// LV3：做 LV2，並加上上方套票新增時，下方 C3 與套票列表也會即時更新
 
let data=[];
 
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    // console.log(response.data.data);
    return data=response.data.data;
  });


//宣告變數
const formSelect=document.querySelector('.formselect'); // 切換的下拉表單
const searchNum=document.querySelector('.searchNum');  // 搜尋資料筆數
const  cardArea=document.querySelector('.cardarea'); // 資料畫面

// LV3 新宣告變數
const ticketName=document.querySelector('.ticketname'); //OK
const imageUrl=document.querySelector('.imageurl'); //OK
const sinceryArea=document.querySelector('.sinceryarea');//OK
const ticketCost=document.querySelector('.ticketcost');  //OK
const ticketNum=document.querySelector('.ticketnum');
const ticketRanking=document.querySelector('.ticketranking');
const ticketDescription=document.querySelector('.ticketdescription');
const ticketAdd=document.querySelector('.ticketadd');//OK
// console.log(ticketName,imageUrl,sinceryArea,ticketCost,ticketNum,ticketRanking,ticketDescription,ticketAdd)

//註冊按鈕之監聽防呆＋新增旅遊套票
ticketAdd.addEventListener('click',function(e){
  let obj = {};
  obj.id = data.length;
  obj.name = ticketName.value;
  obj.imgUrl = imageUrl.value;
  obj.area = sinceryArea.value;
  obj.description = ticketDescription.value;
  obj.group = Number(ticketNum.value);
  obj.price = Number(ticketCost.value);
  obj.rate = Number(ticketRanking.value);

  if (obj.name !== "" && obj.imgUrl !== "" && obj.area !== "" && obj.description !== "" && obj.group >= 0 && obj.price >= 0 && (1<=obj.rate && obj.rate<=10)){
      data.push(obj);
  }else{
      alert("請確認是否都已填寫完畢、星級在 1 ~ 10 區間");
  }
 init();
  
})
// 防呆函式
 

//更換資料-初始化資料
function init( ){
    let str=``;
    let searchCount=0; //預設搜尋幾筆
    data.forEach(function(item,index){
        searchCount++;
    let content= `<div class="card shadow  mb-5 bg-body rounded  position-relative cardset data-num="${index}">
    <img src="${item.imgUrl}" class="card-img-top" alt="...">
    <span class="position-absolute top-0    badge   bg-secondary fs-3 py-4 px-4 ">${item.area} <span class="visually-hidden">unread messages</span></span> 
    <span class="position-absolute  top-50    badge   bg-primary fs-4 py-2 px-2 ">${item.rate}<span class="visually-hidden">unread messages</span></span> 
    <div class="card-body  ">
     
      <h5 class="card-title text-primary border-bottom border-primary border-2 pb-3 fs-3">${item.name}</h5>
      <p class="card-text text-info fs-5 h-50">${item.description}</p>
      <div class="d-flex justify-content-between">
      <a href="#" class="text-primary fw-bolder text-decoration-none align-self-center"><span class="iconify" data-icon="akar-icons:circle-plus-fill" data-inline="false" style="color: #00807E;"></span>剩下最後<span>${item.group}</span>組</a>
      <a href="#" class="text-primary fw-bolder text-decoration-none">TWD<span class="fs-3">${item.price}</span></a>
    </div>
    </div>
    </div>`;
    str+=content;
    searchNum.textContent=searchCount;
     
     
    });
     
     cardArea.innerHTML=str;
    
    }
 
    
// 篩選
 
  formSelect.addEventListener('change',function(e){
    // console.log(e.target.value);
    data.forEach(function(item,index){
      if(e.target.value==data[index].area){
        // console.log(e.target.value);
        // console.log(data[index].area);
        // 渲染畫面＋搜尋的筆數
        let searchCount=0;
        searchCount++;
         let str=``;
         let content= `<div class="card shadow  mb-5 bg-body rounded  position-relative cardset">
    <img src="${item.imgUrl}" class="card-img-top" alt="...">
    <span class="position-absolute top-0    badge   bg-secondary fs-3 py-4 px-4 ">${item.area} <span class="visually-hidden">unread messages</span></span> 
    <span class="position-absolute  top-50    badge   bg-primary fs-4 py-2 px-2 ">${item.rate}<span class="visually-hidden">unread messages</span></span> 
    <div class="card-body  ">
     
      <h5 class="card-title text-primary border-bottom border-primary border-2 pb-3 fs-3">${item.name}</h5>
      <p class="card-text text-info fs-5 h-50">${item.description}</p>
      <div class="d-flex justify-content-between">
      <a href="#" class="text-primary fw-bolder text-decoration-none align-self-center"><span class="iconify" data-icon="akar-icons:circle-plus-fill" data-inline="false" style="color: #00807E;"></span>剩下最後<span>${item.group}</span>組</a>
      <a href="#" class="text-primary fw-bolder text-decoration-none">TWD<span class="fs-3">${item.price}</span></a>
    </div>
    </div>
    </div>`;
        str+=content;
        cardArea.innerHTML=str;
        searchNum.textContent=searchCount;
        renderC3();
      }else if(e.target.value=="全部地區"){
        return init();
      }
    //  console.log(data);
         //「資料搜集」
    function renderC3(){
      let totalObj={};
      console.log(data);
      data.forEach(function(item,index){
        console.log(item);
        if(totalObj[item.area]==undefined){
          totalObj[item.area]=1;
        }else{
          totalObj[item.area]+=1;
        }
        console.log(totalObj);
       
      }) // dataforEach結尾
      let newData=[];
        let areaC3=Object.keys(totalObj);
        console.log(areaC3);
        areaC3.forEach(function(item,index){
          let ary=[];
          ary.push(item);
          ary.push(totalObj[item]);
          newData.push(ary);
        })
         // c3圖表
  const chart = c3.generate({
    bindto: ".chart",
    data: {
      columns: newData,
      type : 'donut',
    },
    donut: {
      title: "地區"
    }
  });
   } //renderC3 結尾

   
    });

    

  });

 


 




