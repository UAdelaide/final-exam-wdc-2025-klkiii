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
        if (confirm("Are you sure you want to relod the dog image?")){
            this.fetchDog();
        }
    },
    startBooking(){
        this.showBookingStep2 = true;
    },
    confirmBooking(){
        alert("Booking confirmed!")
    }
},
mounted(){
    this.fetchDog();
}
}).mount('#app');