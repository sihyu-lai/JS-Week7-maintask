/***  設定變數 ***/
let data;
// 設定 DOM 選擇器
const ticketCards = document.querySelector('.ticketCard-area');
// DOM for 搜尋地區資料 
const searchOption = document.querySelector(".regionSearch");
const searchTotal = document.querySelector('.searchTotal');
// DOM for 表單新增
const ticketName = document.querySelector(".ticketName");
const ticketImgUrl = document.querySelector(".ticketImgUrl");
const ticketRegion = document.querySelector(".ticketRegion");
const ticketPrice = document.querySelector(".ticketPrice");
const ticketNum = document.querySelector(".ticketNum");
const ticketRate = document.querySelector(".ticketRate");
const ticketDescription = document.querySelector(".ticketDescription");
const addTicketBtn = document.querySelector(".addTicket-btn"); // 新增資料的按鈕


function init() {
    axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
        .then(function (response) {
            data = response.data;
            // console.log(data);
            renderC3();
            renderCards();
            searchOption.value = "全部地區";
        });
};

function renderC3() {
    // 蒐集資料
    let totalObj = {};
    data.forEach(function (item) {
        // console.log(item);
        if (totalObj[item.area] == undefined) {
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area]++;
        }
        // console.log(totalObj);
    });

    // 處理資料呈 C3 格式（陣列包陣列）
    let newData = [];
    let area = Object.keys(totalObj); // [高雄, 台中, 台北]
    area.forEach(function (item) {
        let ary = [];
        ary.push(item);
        ary.push(totalObj[item]);
        // console.log(ary);
        newData.push(ary);
    });
    // console.log(newData);

    // 呈現出 C3 圖表
    const chart = c3.generate({
        bindto: ".chart",
        data: {
            columns: newData,
            type: 'donut',
            colors: {
                台北: '#26C0C7',
                台中: '#5151D3',
                高雄: '#E68619'
            },
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false
            }
        }
    });
};

function renderCards() {
    let str = "";
    let searchCount = 0;
    data.forEach(function (item) {
        searchCount++;
        str += `<li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${item.imgUrl}" alt="">
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rate}</div>
            </div>
            <div class="ticketCard-content">
                 <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                            ${item.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                        </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                </div>
            </div>
        </li>`;
    });
    ticketCards.innerHTML = str;
    searchTotal.textContent = searchCount;
}


init();

// 篩選功能
searchOption.addEventListener("change",function(e){
    // console.log(e.target.value);
    if(e.target.value == "地區搜尋"){
    // console.log("456");
        return ;
    }
    if(e.target.value == "全部地區"){
        // console.log("456");
        renderC3();
        renderCards();
        return ;
    }
    let str = "";
    let searchCount = 0; // 計算搜尋幾筆資料
    data.forEach(function(item,index){
        // console.log(e.target.value == item.area);
        if(e.target.value == item.area){
            searchCount ++;
            str += `<li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                        <img src="${item.imgUrl}" alt="">
                    </a>
                    <div class="ticketCard-region">${item.area}</div>
                    <div class="ticketCard-rank">${item.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                        <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                        </h3>
                        <p class="ticketCard-description">
                            ${item.description} 
                        </p>
                    </div>
                    <div class="ticketCard-info">
                        <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                        </p>
                        <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">${item.price}</span>
                        </p>
                    </div>
                </div>
            </li>`;
            ticketCards.innerHTML = str;
            searchTotal.textContent = searchCount;
        }
    }); 
});

// 新增功能
addTicketBtn.addEventListener("click",function(e) {
    // console.log(ticketName.value, ticketImgUrl.value, ticketRegion.value, ticketPrice.value, ticketNum.value, ticketRate.value, ticketDescription.value); 

    let obj = {};
    obj.id = data.length;
    obj.name = ticketName.value;
    obj.imgUrl = ticketImgUrl.value;
    obj.area = ticketRegion.value;
    obj.description = ticketDescription.value;
    obj.group = Number(ticketNum.value);
    obj.price = Number(ticketPrice.value);
    obj.rate = Number(ticketRate.value);

    if (obj.name !== "" && obj.imgUrl !== "" && obj.area !== "" && obj.description !== "" && obj.group >= 0 && obj.price >= 0 && (1<=obj.rate && obj.rate<=10)){
        data.push(obj);
    }else{
        alert("請確認是否都已填寫完畢、星級在 1 ~ 10 區間");
    }
    renderC3();
    renderCards();
    searchOption.value = "全部地區";
    // console.log(data);
    ticketName.value = "";
    ticketImgUrl.value = "";
    ticketRegion.value = "";
    ticketDescription.value = "";
    ticketNum.value = "";
    ticketPrice.value = "";
    ticketRate.value = "";
});