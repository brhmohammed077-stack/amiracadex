const words = {
 ar:{sent:"تم إرسال الطلب بنجاح. سنتواصل معك قريبًا.",fail:"تعذر إرسال الطلب. حاول مرة أخرى أو تواصل معنا عبر البريد الإلكتروني.",missing:"لم يتم ضبط خدمة استقبال الطلبات بعد. أضف رابطها في config.js ثم أعد نشر الموقع.",invalid:"يرجى إكمال الحقول المطلوبة والتحقق من صحة البيانات.",sending:"جارٍ إرسال طلبك...",track:"واجهة التتبع جاهزة بصريًا، لكن يلزم ربطها بقاعدة بيانات الطلبات لعرض حالة حقيقية.",trackFound:"لا توجد نتيجة مرتبطة بهذا الرقم في هذا النموذج التجريبي."},
 fr:{sent:"Demande envoyée. Nous vous contacterons bientôt.",fail:"Envoi impossible. Réessayez ou contactez-nous par e-mail.",missing:"Configurez le point de réception dans config.js avant de publier.",invalid:"Vérifiez les champs obligatoires.",sending:"Envoi en cours...",track:"Le suivi nécessite une connexion à une base de données des commandes.",trackFound:"Aucun résultat dans cette démonstration."},
 en:{sent:"Request sent successfully. We will contact you soon.",fail:"Unable to send. Try again or contact us by email.",missing:"Configure the order endpoint in config.js before publishing.",invalid:"Please check the required fields.",sending:"Sending your request...",track:"Tracking needs to be connected to a live orders database.",trackFound:"No result for this ID in the demo."}
};
let currentLang="ar";
function setLang(lang){
 currentLang=lang;
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 document.body.classList.toggle("en",lang==="en");
 document.getElementById("langToggle").textContent=lang==="ar"?"FR / EN":lang==="fr"?"AR / EN":"AR / FR";
}
document.getElementById("langToggle").addEventListener("click",()=>setLang(currentLang==="ar"?"fr":currentLang==="fr"?"en":"ar"));
document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{const s=document.querySelector('[name="service"]');if(s)s.value=link.dataset.service;}));
document.getElementById("year").textContent=new Date().getFullYear();
const form=document.getElementById("orderForm"), statusEl=document.getElementById("formStatus");
form.addEventListener("submit",async event=>{
 event.preventDefault();statusEl.className="form-status";
 if(!form.reportValidity()){statusEl.textContent=words[currentLang].invalid;statusEl.classList.add("error");return;}
 const config=window.ACADEX_CONFIG||{};
 if(!config.formEndpoint){statusEl.textContent=words[currentLang].missing;statusEl.classList.add("error");return;}
 const button=form.querySelector('button[type="submit"]');button.disabled=true;statusEl.textContent=words[currentLang].sending;
 const data=Object.fromEntries(new FormData(form).entries());
 data.site="ACADEX";data.notificationEmail=config.recipientEmail||"goldennarthur@gmail.com";data.submittedAt=new Date().toISOString();
 try{
  const response=await fetch(config.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)});
  if(!response.ok)throw new Error("Request failed");
  form.reset();statusEl.textContent=words[currentLang].sent;statusEl.classList.add("success");
 }catch(err){statusEl.textContent=words[currentLang].fail;statusEl.classList.add("error");}
 finally{button.disabled=false;}
});
document.getElementById("trackForm").addEventListener("submit",event=>{
 event.preventDefault();
 const status=document.getElementById("trackStatus");
 status.textContent=words[currentLang].track+" "+words[currentLang].trackFound;
 status.classList.add("track-warning");
});
const whats=document.querySelector("[data-whatsapp]");
if(whats)whats.addEventListener("click",event=>event.preventDefault());
setLang("ar");
