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
    register(){

        let o ={
            phone:{
                value:this.userRegisterInfo.phone,
                msg:'你的号码格式不正确',
                reg:/^1[3-9]\d{9}$/
            },
            password:{
                value:this.userRegisterInfo.password,
                msg:'你的密码格式不正确',
                reg:/^[A-Za-z]\w{5,15}$/
            },
            nickName:{
                value:this.userRegisterInfo.nickName,
                msg:'你的昵称格式不正确',
                reg:/^[\w\u4e00-\u9fa5]{1,10}$/
            }
        }
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
            userInfo.appkey=this.appkey;

            //发起请求
            this.axios({
                method:"POST",
                url:"/register",
                data:userInfo
            }).then(result=>{
                // 
                 //关闭加载提示
                this.$toast.clear();

                if (result.data.code == 700) {
                    //token检验无效,则跳到登录页面
                    this.$toast('token检验无效')
                    return this.$router.push({name: 'Login'});
                }

                if(result.data.code==100){
                    this.show=false;
                    this.$toast('注册成功');
                }else{
                     //如果注册失败，手机被注册了
                    this.$toast(result.data.msg);
                }
            }).catch(err=>{
                
            })
        }
    },
    //构造登录验证信息
    login(){
        
        let ele ={
            phone:{
                value:this.userInfo.phone,
                msg:'你的号码格式不正确',
                reg:/^1[3-9]\d{9}$/
            },
            password:{
                value:this.userInfo.password,
                msg:'你的密码格式不正确',
                reg:/^[A-Za-z]\w{5,15}$/
            }
        }

        // 
        let isLg=form.valid(ele)

        if(isLg){
             //启动加载提示
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
            userInfo.appkey=this.appkey;

            //发起请求
            this.axios({
                method:"POST",
                url:"/login",
                data:userInfo
            }).then(result=>{
                 //关闭加载提示
                this.$toast.clear();

                if(result.data.code==200){
                    this.$toast('登录成功');
                    //保存token, 以便后面验证登录
                    localStorage.setItem('__tk', result.data.token);
                    this.$router.push({name:"Home"})
                    
                }else{
                
                    this.$toast(result.data.msg);
                }
            }).catch(err=>{
                
            })
        }
    },
    //游客进入
    you(){
        this.$router.push({name:"Home"})
    }


    },
    created(){
        
    }
};
</script>

<style lang="less" scoped>


</style>

