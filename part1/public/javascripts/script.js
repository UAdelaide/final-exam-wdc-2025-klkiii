const { createApp, onMounted, ref} = Vue;

createApp({
    data(){
        return {
        dogImage:'',
        showBookingStep2: false,
        cursor:{x:0,y:0},

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