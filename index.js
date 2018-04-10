    $(function(){
    //google-map for JS
    //改寫google map參數
    var rdPoint = document.getElementById("rd-point");
    var rdDistance = document.getElementById("rd-distance");
    var btnPost = document.getElementById("goo-post");
    var btnReset = document.getElementById("goo-reset");
    rdPoint.addEventListener("click",chage_radio);
    rdDistance.addEventListener("click",chage_radio);
    btnPost.addEventListener("click",map_give);
    btnReset.addEventListener("click",map_reset);
	function map_give() {
        var map = document.getElementById("googlemap");
		if (rdDistance.checked == true) {
			var start_text = document.getElementById("goo-start").value;
			var end_text = document.getElementById("goo-end").value;
			var meetingPlace = document.getElementById("meetingPlace");
			map.src = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyDwpxBFKSEleqxSG3l-Y6N10YK2_2izTSs&origin="
					+ start_text + "&destination=" + end_text;
		} else {
			var point_text = document.getElementById("goo-point").value;
			map.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDwpxBFKSEleqxSG3l-Y6N10YK2_2izTSs&q="
					+ point_text;
		}
	};
	//切換google map 的radio時 改變textBox的格子	
	function chage_radio() {
		var start_text = document.getElementById("goo-start");
		var end_text = document.getElementById("goo-end");
		var point_text = document.getElementById("goo-point");
		if (rdPoint.checked == true) {
            start_text.disabled = true;
            end_text.disabled = true;
            point_text.disabled = false;
		} else if (rdDistance.checked == true) {
            start_text.disabled = false;
            end_text.disabled = false;
            point_text.disabled = true;
		}
    };
    //reset val
    function map_reset(){
        document.getElementById("goo-start").value='';
        document.getElementById("goo-end").value='';
        document.getElementById("goo-point").value='';
    }
    //news api
    //q=souces sortBy=relevancy|popularity|publishedAt from=yyyy-mm-dd&to=yyyy-mm-dd country=us 
    $('#news-btn').click(function(){
        $('.news-top5').empty();
      var keyWord = $('#key-word').val();
      var radioBtn = $('input[name="serchMode"]:checked').val(); 
      var newsUrl="https://newsapi.org/v2/everything?"
        +"q="+keyWord
        +"&sortBy="+radioBtn
        +"&apiKey=f3e1f1e64c4d4bbe8d86531100a2a903"
      $.get(newsUrl,function(data){
        for(var i=0 ; i<=4 ;i++){
            console.log(data.articles[i]);
            var title = data.articles[i].title;
            var imgUrl = data.articles[i].urlToImage;
            var linkUrl = data.articles[i].url;
            var description = data.articles[i].description;
            var publishedAt =data.articles[i].publishedAt;
            var newsDiv=$('<div class="top-5"><div>');
            var linkA = $('<a>'+'</a>').attr('href',linkUrl).append(title);
            var titleLink = $('<h2></h2>').append(linkA);
            var newsImg=$('<img></img>').attr({'width':'auto','src':imgUrl});
            var describe = $('<p>'+description+'</p>');
            var publish = $('<p>'+publishedAt+'</p>');
            newsDiv = newsDiv.append(titleLink).append(newsImg).append(describe).append(publish);
            $('.news-top5').append(newsDiv);
        }
      })  
    })
    $('.addItem').click(function(){
        var hao = $('#key-word').val();
        var h1 = $('<div></div>').append("<h1></h1>");
        $('.news-top5').html(h1);
    })
    Vue.component('movie-api',{
        template:'#movie-api',
        props:{
            getLeftData:null,
            omdbShow:null,
            getRightData:null,
            tmdbShow:null,
        },
        data:function(){
            return{
                movieType:{type:['電影','影集','特定集數'],value:['movie','series','episode']},
                radioValue:'movie',
            }
        },
        methods:{
            reportData:function(){
                var self = this;
                self.$parent.$emit('update',self.radioValue);
            },
        },
        created:function(){

        },
    })
    var movieApi=new Vue({
        el:'.movie-api',
        data:{
            serchKye:'harry potter',
            'OMDbSerchData':{},
            'TMDbSerchData':{},
            omdbShowPar:false,
            tmdbShowPar:false,
        },
        methods:{
            movieAjax:function(radioValue){
                var self = this;
                var type = radioValue;
                var TMDbImg = 'https://image.tmdb.org/t/p/w500';
                var TMDbMovieApi='https://api.themoviedb.org/3/search/movie?api_key=5d7d63684e452e2dac23b11c75a21806'
                +'&query='+self.serchKye;
                var OMDbMovieApi='http://www.omdbapi.com/?apikey=e25a9438'
                +'&s='+self.serchKye;
                +'&type='+type;
                $.ajax({
                    url:TMDbMovieApi,
                    type:"GET",
                    success:function(data){
                        //console.log(data);
                        //資料排序 year小到大
                       if(data.total_results != 0 ){
                        self.TMDbSerchData = data.results.sort(function(a,b){
                            return a.release_date > b.release_date?1:-1;
                        })
                        //圖片存放路徑不同
                        for(var i = 0; i<self.TMDbSerchData.length;i++){
                            self.TMDbSerchData[i].poster_path=TMDbImg+self.TMDbSerchData[i].poster_path;
                        }
                        self.tmdbShowPar=true;
                       }else{
                           alert('TMDb資料錯誤')
                           self.tmdbShowPar=false;
                       }
                    },
                    error:function(){

                    }
                });   
                
                console.log(OMDbMovieApi);
                $.ajax({
                    url:OMDbMovieApi,
                    type:"GET",
                    success:function(data){
                        //資料排序 year小到大
                        console.log(data);
                        if(data.Response != "False"){
                            self.OMDbSerchData = data.Search.sort(function(a,b){
                                return a.Year>b.Year?1:-1;
                            })
                            console.log(self.OMDbSerchData);
                            self.omdbShowPar=true;
                        }else{
                            /*
                            alert('資料有錯');
                            self.omdbShowPar=false;
                            */
                        }
                    },
                    error:function(){
                        /*
                        alert('OMDb資料錯誤');
                        */
                    }
                })
            },
        },
        computed:{

        },
        watch:{

        },
        mounted:function(){
            var self=this;
            self.$on('update',this.movieAjax);
        },
        created:function(){
          
        },
    })
    /* JS 的 AJAX */
    /*
    var newsUrl="https://newsapi.org/v2/everything?"
    +"q=bitcoin"
    +"&sortBy=relevancy"
    +"&apiKey=f3e1f1e64c4d4bbe8d86531100a2a903"
    var currentDate=new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var day = currentDate.getDate();
    function makeRequest(){
        xhr = new XMLHttpRequest();
        xhr.onload = function(){
            console.log(typeof(this.responseText));
            var response = JSON.parse(this.responseText);
            console.log(response);
        };
        xhr.open("GET",newsUrl,true);
        xhr.send();
    }
    makeRequest();
    */
/* Vue 的日期選擇 
    if(month.toString().length==1){
        month='0'+month;
    }
    if(day.toString().length==1){
        day='0'+day;
    }
    var startDate = month+'/'+day+'/'+ year;
    Vue.component('datepicker', {
        template: '#datepicker-template',
        props: ['value'],
        mounted: function () {
            var self = this;
            $(self.$el)                    
                .datepicker({ value: startDate }) // init datepicker
                .trigger('change')                    
                .on('change', function () { // emit event on change.
                    self.$emit('input', this.value);
                })
            },
        watch: {
            value: function (value) {
                    $(this.$el).val(value);
                }
            },
            destroyed: function () {
                $(this.$el).datepicker('destroy');
            }
        })
        var app = new Vue({
            el: '#app',
            template: '#demo-template',
            data: {
                value: startDate
            },
        })
*/
})