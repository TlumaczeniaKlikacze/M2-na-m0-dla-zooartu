try {
    let m1=0;
    let m0=0;
    let m2 =0
    let count_auto_gen_numbers = 0;
const div_container = document.createElement('div')
div_container.innerHTML =  `<span id="text" style="color:red;width:100%;text-align:center"></span>
<div style="display:flex; flex-direction:row; margin-top:10px; justify-content:space-between"> <button id="btn_m0_to_m1" style="display:none">Zamień M0 na M1</button> <button id="btn_m1_to_m0">Zamień M2 na M0</button> </div>
<span id="span_m1" style ="text-align:center">Zliczam</span>
<span id="span_m0" style ="text-align:center">Zliczam</span>
<span id="span_m2" style ="text-align:center">Zliczam</span>
<span id="suma_span" style ="text-align:center"></span>
<span style ="text-align:center; color:red;">Uwaga! Sprawdz czy zliczona ilość odpowiada liczbie produktów</span>
<button id="count_items" >Policz M'y</button>`
div_container.style.display = "flex"
div_container.style.width = '100%'
div_container.style.height = '240px'
div_container.style.flexDirection = 'column'
div_container.style.border = `2px solid green`
const table_el = document.getElementsByClassName('description')
for(let x=0;x<table_el.length;x++){
    if(table_el[x].innerText == 'Realizacja z magazynu'){
        table_el[x].appendChild(div_container)
    }
}
const promise_check_close_container = ()=>{
    return new Promise((res,rej)=>{
         const areyouThere = setInterval(() => {
            const btn = document.querySelectorAll('a[class="container-close"]');
            if(btn ){
                for(let i =0;i<btn.length;i++){
                    btn[i].click()
                }
                clearInterval(areyouThere)
                res()
            }
        }, 500);
    })
}
const promise_to_click_are_you_sure = ()=>{
    return new Promise((res,rej)=>{
        //cczy chcesz dokonac zmian
        const areyouThere = setInterval(() => {
            const btn = document.querySelector(`#yui-gen${count_auto_gen_numbers}-button`);
            if(btn != null){
                count_auto_gen_numbers = count_auto_gen_numbers+2
                clearInterval(areyouThere)
                btn.click()
                res()
            }else{
                //jesli uzytkownik juz cos klikal i generowane liczby nei sa po kolei 
                // coś sie zjebbało i nie ma go to teraz trzebaa bedzzie wykminic cos
                for(let i=count_auto_gen_numbers;i<500000;i++){
                    if(document.querySelector(`#yui-gen${i}-button`) != null && i%2 ==0){
                        count_auto_gen_numbers = i+2
                        clearInterval(areyouThere)
                        document.querySelector(`#yui-gen${i}-button`).click()
                        res()
                        break
                    }
                }
            }
        }, 500);
    })
}
const promise_to_click_dostawy = ()=>{
    return new Promise((res,rej)=>{
        const btn = setInterval(() => {
            let aadd_item = document.querySelectorAll("a[class='nohref nohrefmenu']")
            if(aadd_item.length > 0){
                clearInterval(btn)
                res(aadd_item[0])
            }
        }, 500);
   
    })
}
const promise_to_save_the_change = ()=>{
    return new Promise((res,rej)=>{
        const where_are_you = setInterval(() => {
            const btn_accept_change = document.querySelectorAll('input[class="btn btn-primary formbutton"]')
            if(btn_accept_change != null){
                clearInterval(where_are_you)
                for(let j=0;j<btn_accept_change.length;j++){
                    btn_accept_change[j].click()
            }
                res()
            }
        }, 500);
    })
}
const promise_wait_for_confirm_from_db = ()=>{
    return new Promise((res,rej)=>{
        const wait_for_response_from_db = setInterval(() => {
            const info = document.querySelector("#msg_text_dialog_message")
            if(info != null){
                info.remove()
                clearInterval(wait_for_response_from_db)
                res();
            }
        }, 50);
    })
}
const promise_to_do_work = (btn,option)=>{
    return new Promise(async(res,rej)=>{
        btn.click()
       let btn_to_click = await promise_to_click_dostawy()
       btn_to_click.click()      
       const interval = setInterval(async() => {
        const input_m0_1 = document.getElementsByName("order_quantity[0]")[0]//m0
        const input_m0_2 = document.getElementsByName("reservation_quantity[0]")[0]
        const input_m1_1 = document.getElementsByName("order_quantity[2]")[0]//m2
        const input_m1_2 = document.getElementsByName("reservation_quantity[2]")[0]
        if(input_m0_1 != null && input_m0_2 != null && input_m1_1 != null &&input_m1_2 != null){
            switch (option) {
            case 'm1_to_m0':
                
                if(input_m0_1.value !=0  &&input_m0_2.value !=0  &&input_m1_1.value ==0&&input_m1_2.value ==0){
                    clearInterval(interval)
                    await promise_check_close_container()
                    res()
                }else if(input_m0_1  && input_m0_2  &&input_m1_1&&input_m1_2){
                    clearInterval(interval)
                        input_m0_1.value =  parseInt(input_m1_1.value) + parseInt(input_m0_1.value)///dodaje
                        input_m0_2.value = parseInt(input_m1_2.value)  + parseInt(input_m0_2.value) //dodaje
                        input_m1_1.value = 0
                        input_m1_2.value = 0
                        await promise_to_save_the_change()//zapisz zmiany
                        await promise_to_click_are_you_sure();//potwierdzam ze jestem pewny
                        await promise_wait_for_confirm_from_db()
                        await promise_check_close_container()//zamykam okno
                    res()
                }
            
            break
            }
        }
       }, 500);  
    })
}

document.getElementById("btn_m1_to_m0").addEventListener('click',async()=>{
    document.querySelector('#text').innerHTML="Prosze czekać... </br>Smacznej kawusi ^_^"
        const buttons_operation = document.querySelectorAll("a[href='#editQuantity']");
            for(let i =0; i<buttons_operation.length;i++){
                await promise_to_do_work(buttons_operation[i],'m1_to_m0')
            }
            await countMs()

})
document.getElementById('count_items').addEventListener("click",async()=>{
    await countMs()
})
const countMs = ()=>{
    return new Promise((res,rej)=>{
        document.querySelector("#span_m1").innerHTML = `Zliczam`
        document.querySelector("#span_m0").innerHTML = `Zliczam`
        document.querySelector("#span_m2").innerHTML = `Zliczam`
        m1=0
        m0=0
        m2=0
        const allMs = document.getElementsByClassName("yui-dt0-col-quantity yui-dt-col-quantity");

        for(let i=0;i<allMs.length;i++){
           if( (new RegExp('M2')).test(allMs[i].innerText))
            m2++
           if( (new RegExp('M0')).test(allMs[i].innerText))
            m0++;
            if ((new RegExp('M1')).test(allMs[i].innerText))
            m1++
           
        }
        document.querySelector("#span_m1").innerHTML = `Jest ${m1} produktów na M1!`
        document.querySelector("#span_m0").innerHTML = `jest ${m0} produktów na M0!`
        document.querySelector("#span_m2").innerHTML = `jest ${m2} produktów na M2!`
        let sum = m1+m0+m2;
        document.querySelector('#suma_span').innerHTML = `Suma: ${sum}`
        res()
    })
}
function start(){
    document.querySelector('#text').innerHTML="Prosze czekać, ładowanie produktów"
    document.getElementById("btn_m1_to_m0").disabled = true
    document.getElementById("btn_m0_to_m1").disabled = true
    document.getElementById('count_items').disabled = true;
    const intervalItems = setInterval(() => {
        const buttons_operation = document.querySelectorAll("a[href='#editQuantity']");
        if(buttons_operation.length>0){
            clearInterval(intervalItems)
            setTimeout(async() => {
                await countMs()
                document.querySelector('#text').innerHTML="Można śmiało korzystać!"
                document.getElementById("btn_m1_to_m0").disabled = false
                document.getElementById("btn_m0_to_m1").disabled = false
                document.getElementById('count_items').disabled = false
            }, 5000);
        }
    }, 200);
}
start()
} catch (error) {

}
