import{l as w,m as V,r as f,o as r,c as n,u as i,i as v,g as m,t as y,a as p}from"./index-14175f2c.js";import{B as d}from"./BaseInput-591e766a.js";const h=p("h1",null,"Login",-1),_=p("button",{type:"submit"},"Login",-1),b={key:1},L={__name:"LoginView",setup(B){const c=w(),t=V(),u={username:"",password:""},s=f({...u}),l=()=>Object.assign(s.value,u),g=async()=>{try{await t.login(s.value),t.setUser(),l(),c.replace({name:"Authenticated",params:{id:t.g$user.id}})}catch(o){console.log(o),alert(o)}};return(o,e)=>(r(),n("div",null,[h,i(t).getUsername?(r(),n("h3",b,y(i(t).getUsername),1)):(r(),n("form",{key:0,method:"post",onSubmit:e[2]||(e[2]=v(()=>g(),["prevent"])),onReset:e[3]||(e[3]=()=>l())},[m(d,{name:"username",modelValue:s.value.username,"onUpdate:modelValue":e[0]||(e[0]=a=>s.value.username=a),placeholder:"input username",required:""},null,8,["modelValue"]),m(d,{name:"password",modelValue:s.value.password,"onUpdate:modelValue":e[1]||(e[1]=a=>s.value.password=a),placeholder:"input password",type:"password",required:""},null,8,["modelValue"]),_],32))]))}};export{L as default};