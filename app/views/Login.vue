<template>
    <div class="Login">
        <!-- 顶部栏 -->
        <van-nav-bar>
    <template #left>
    <div class="top-left">
        <div class="logo">

        </div>
        <div class="top-left-text">众口尝 coffee</div>
    </div>
    </template>
    <template #right>
    <div class="top-right" @click="you">游客进入</div>
    </template>

</van-nav-bar>
    <!-- 内容 -->
    <div class="main">
        <h1>生活的调味剂 !</h1>
        <p class="lg-title">Life so many charming</p>
    </div>
    <div class="user">
    <van-form >
    <van-field
    v-model="userInfo.phone"
    name="手机号"
    label="手机号"
    placeholder="手机号"
    autocomplete="off"
    />
    <van-field
    v-model="userInfo.password"
    :type="isEyeusername ?'username' :'password'"
    name="密码"
    label="密码"
    placeholder="密码"
    autocomplete="off"
    :right-icon='isEyeusername?"eye-o":"closed-eye"'
    @click-right-icon="togget"
    />
    
    <div style="margin:50px 16px 30px; ">
    <van-button round block type="info" @click="login" >
        登录
    </van-button>
    </div>
    <div style="margin: 35px  16px 5px;">
    <van-button round block type="default"  @click='showPopup'>
        注册
    </van-button>
    </div>
    <div class="forgot">
    <van-button round block type="default" size='mini' @click="goforgot">
        忘记密码 !
    </van-button>
    </div>
</van-form>

</div>

<!-- 弹出层 -->

<van-popup v-model="show"  position="bottom" closeable>
    <div class="user-top-title">注册</div>
    <van-form >
<van-field
    v-model="userRegisterInfo.phone"
    name="手机号"
    label="手机号"
    placeholder="11位手机号"
    autocomplete="off"
    />

    <van-field
    v-model="userRegisterInfo.password"
    :type="isEyepawss ?'username' :'password'"
    name="密码"
    label="密码"
    placeholder="字母数字_组合且字母开头(6-16位)"
    autocomplete="off"
    :right-icon='isEyepawss?"eye-o":"closed-eye"'
    @click-right-icon="toggeta"
    />

    
    <van-field
    v-model="userRegisterInfo.nickName"
    type="username"
    name="昵称"
    label="昵称"
    placeholder="字母数字_汉字组合(1-10位)"
    autocomplete="off"
    />
    <div class="register" style="margin: 35px  16px;">
    <van-button round block type="info" @click="register">
        注册
    </van-button>
    
    </div>
    </van-form>
</van-popup>

    </div>
    
</template>

<script>
    import '../assets/css/login.less'

    import {form} from "../assets/js/form"
    import {getLocal,saveLocal} from "../utils/local.js"
    import {login,register} from "../api/login.js"
    import {getmy,allmyData} from "../api/my.js"
    // import { mapMutations } from 'vuex'

export default {
    name:'Login',
    data() {
    return {
        //注册框显示状态
        show: false,
        userInfo:{
            phone:'',
            password:''
        },
        userRegisterInfo:{
            phone:'',
            password:'',
            nickName:''
        },
        // 登录的eye show and hide or password and username
        isEyeusername:false,
        // 登录的eye show and hide or password and username
        isEyepawss:false
        
    };
    },

    methods: {


    showPopup() {
        
        this.show = true;
    },
    //忘记密码
    goforgot(){
        this.$router.push({name:'Forgot'})
    },
    togget(){
        this.isEyeusername=!this.isEyeusername;
    },
    toggeta(){
        this.isEyepawss=!this.isEyepawss;
    },
    //构造注册验证信息
    async register(){

        // 验证规则
        let o = {
            phone:form.phone(this.userRegisterInfo.phone),
            password:form.password(this.userRegisterInfo.password),
            nickName:form.nickName(this.userRegisterInfo.nickName),           
        }
        //表单验证
        let isFt=form.valid(o)

        if(isFt){
             //启动加载提示
            this.$toast.loading({
            //文本提示
            message: '注册中...',
            //禁止穿透点击
            forbidClick: true,
            //提示时间, 0: 没有时间限制
            duration: 0
            });

            //复制用户注册信息
            let userInfo=Object.assign({},this.userRegisterInfo);
            // userInfo.appkey=this.appkey;

            //发起请求 
            let res = await register(userInfo)
            if(res.data.code==100){
                //关闭加载提示
                this.$toast.clear()
                    this.show=false;
                    this.$toast('注册成功');
            }else{
                //关闭加载提示
                this.$toast.clear()
                     //如果注册失败，手机被注册了
                     // 未能请求成功提示错误
                    this.$toast(res.data.msg);
            }

        }
    },
    //构造登录验证信息
    async login(){
        // 验证规则
        let ele ={
             phone:form.phone(this.userInfo.phone),
            password:form.password(this.userInfo.password),
        }
        // 验证表单
        let isLg=form.valid(ele)

        if(isLg){
            //  启动加载提示
            this.$toast.loading({
            //文本提示
            message: '登录中...',
            //禁止穿透点击
            forbidClick: true,
            //提示时间, 0: 没有时间限制
            duration: 0
            });

            //复制用户登录信息
            let userInfo=Object.assign({},this.userInfo);
            // userInfo.appkey=this.appkey;

            //发起请求

            let res = await login(userInfo)
            //成功
            if(res.data.code==200){
                //   关闭加载提示
                this.$toast.clear();
                //保存token
                saveLocal(res.data.token)
                this.$toast('登录成功');
                this.$router.push({name:"Home"})
                //修改登录状态
                this.$store.commit("setisLoginStatus",true)
                // this.$store.commit('setisLoginStatus', false)
                //获取我的信息
                let res2 = await getmy()
                if(res2.data.code=="A001"){
                    if(res2.data.result[0].desc==''){
                        res2.data.result[0].desc=='编辑我的个性签名'
                    }

                    this.$store.commit("setuserInfoData",res2.data.result[0])                   
                }else{
                    // 未能请求成功提示错误
                this.$toast(res2.data.msg);
                }
                console.log("我的信息：\n",res2)


                let res3 = await allmyData()
                    if(res3.data.code=="B001"){

                    this.$store.commit("setmyData",res3.data.result[0])                   
                }else{
                    // 未能请求成功提示错误
                this.$toast(res3.data.msg);
                }
                console.log("个人资料\n",res3)

            }else{
                //   关闭加载提示
                this.$toast.clear();
                // 未能请求成功提示错误
                this.$toast(res.data.msg);
            }
        }
    },
    //游客进入
    you(){
        this.$router.push({name:"Home"})
    }


    },
};
</script>


