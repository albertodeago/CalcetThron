<template>
    <q-page class="">
        <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
        >
            <q-tab name="login" label="Log in" />
            <q-tab name="signin" label="Sign in" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="login">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Log in</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input v-model="loginEmail" filled class="q-mb-md" type="email" label="Email" />
                        <q-input v-model="loginPassword" filled type="password" class="q-mb-md" label="Password" />
                    </q-card-section>

                    <q-separator/>

                    <q-card-actions align="right">
                        <q-btn flat @click="onLogin">Log in</q-btn>
                    </q-card-actions>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="signin">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Sign in</div>
                    </q-card-section>

                    <q-card-section>
                        <q-img class="signin-image" :src="imageSource" :ratio="1" @click="selectImage" v-ripple/>
                        <input type="file" accept="image/*" style="display: none" ref="image_picker" @change="imageSelected">
                        <q-input v-model="signinNickname"   class="q-mb-md signin-nickname" filled type="text"      label="Nickname" :rules="[nicknameRule]" lazy-rules />
                        <q-input v-model="signinEmail"      class="q-mb-md" filled type="email"     label="Email" />
                        <q-input v-model="signinPassword"   class="q-mb-md" filled type="password"  label="Password" />
                        <q-input v-model="signinPasswordRe" class="q-mb-md" filled type="password"  label="Confirm password" :rules="[passwordReRule]" lazy-rules />
                    </q-card-section>

                    <q-separator/>

                    <q-card-actions align="right">
                        <q-btn flat @click="onSignin">Register</q-btn>
                    </q-card-actions>
                </q-card>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import EditableAvatar from "../mixins/EditableAvatar"

export default {
    components: {
        
    },
    mixins: [EditableAvatar],
    data() {
        return {
            tab: 'login',
            loginEmail: "",
            loginPassword: "",
            signinNickname: "",
            signinEmail: "",
            signinPassword: "",
            signinPasswordRe: ""
        }
    },
    computed: {
        ...mapGetters('User', ['allUsers'])
    },
    methods: {
        ...mapActions('User', [ 'register', 'login' ]),
        ...mapActions('Global', [ 'setLoading' ]),

        passwordReRule() {
            return (this.signinPassword.length > 0 && this.signinPassword === this.signinPasswordRe) || 'Password mismatch'
        },
        nicknameRule() {
            return this.allUsers === null ? true : (Object.values(this.allUsers).find(u => u.nickname === this.signinNickname) ? 'Nickname already in use' : true)
        },
        async onLogin() {
            this.setLoading(true)
            
            try {
                const res = await this.login({email: this.loginEmail, password: this.loginPassword})
                this.$router.push('/')
            } catch(e){}          

            this.setLoading(false)
        },
        async onSignin() {
            if(this.passwordReRule() !== true || this.signinEmail.length === 0 || this.nicknameRule() !== true) {
                return
            }

            this.setLoading(true)
            await this.register({
                email: this.signinEmail,
                password: this.signinPassword,
                nickname: this.signinNickname,
                image: this.image
            })
            this.setLoading(false)
            
            this.$router.push("/")
        }
    }
}
</script>

<style lang="stylus">

.signin-image 
    width: 50%
    margin-left: 25%
    margin-bottom: 20px
    border-radius: 50%

.signin-nickname 
    padding-bottom: 0

</style>


