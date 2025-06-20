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
    }
}
})