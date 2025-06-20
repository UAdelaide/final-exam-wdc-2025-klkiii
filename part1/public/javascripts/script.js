const { createApp } = Vue;

craeteApp({
    data(){
        return {
        DogImage:'',
        showBookingStep2: false
    };
},

methods:{
    fetchDog(){
        fetch("https://dog.ceo/api/breeds/image/random")
        .then(res=> res.json())
        .then(data=>{
            this.dogImage = data.message;
        });
    },
    multiStepRefresh(){
        if (confirm())
    }
}
})