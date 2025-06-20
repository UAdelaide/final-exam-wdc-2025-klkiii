const { createApp, onMounted, ref} = Vue;

createApp({
    data(){
        return {
        dogImage:'',
        showBookingStep2: false,
        cursor:{x:0,y:0},
        buttons:[]
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
    },
    moveButtonIfClose(btn){
        const rect = btn.getBoundingClientRect();
        const distX = this.cursor.x - (rect.left+rect.width / 2);
        const distY = this.cursor.y - (rect.top +rect.height / 2);
        const distance = Math.sqrt(distX**2 + distY ** 2);

        if (distance < 100){
            const offsetX = (Math.random()-0.5) * 300;
            const offsetY = (Ma)
        }
    }
},
mounted(){
    this.fetchDog();
}
}).mount('#app');