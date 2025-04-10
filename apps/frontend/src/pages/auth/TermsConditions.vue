<script setup>
import { ref } from 'vue'

const currentLanguage = ref('en')

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="flex justify-end mb-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="toggleLanguage"
      >
        {{ currentLanguage === 'en' ? '切換到中文' : 'Switch to English' }}
      </button>
    </div>

    <div v-if="currentLanguage === 'en'">
      <h1 class="text-2xl font-bold mb-6">Terms and Conditions for PV-ESS</h1>
      <p class="mb-4">Last Updated: [Date]</p>

      <p class="mb-6">
        Welcome to PV-ESS. By accessing or using our services, you agree to
        comply with and be bound by the following Terms and Conditions. Please
        read them carefully before using our platform.
      </p>

      <h2 class="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p class="mb-4">
        By using PV-ESS, you acknowledge that you have read, understood, and
        agree to these Terms and Conditions. If you do not agree, please do not
        use our services.
      </p>

      <h2 class="text-xl font-semibold mb-2">2. Services</h2>
      <p class="mb-4">
        PV-ESS provides energy storage solutions and related services. We
        reserve the right to modify or discontinue services at any time without
        prior notice.
      </p>

      <h2 class="text-xl font-semibold mb-2">3. User Responsibilities</h2>
      <ul class="list-disc pl-8 mb-4">
        <li>
          Users must provide accurate and complete information when registering.
        </li>
        <li>Unauthorized use of the platform is strictly prohibited.</li>
        <li>
          Users are responsible for maintaining the confidentiality of their
          account credentials.
        </li>
      </ul>

      <h2 class="text-xl font-semibold mb-2">4. Intellectual Property</h2>
      <p class="mb-4">
        All content on PV-ESS, including but not limited to text, graphics,
        logos, and software, is the property of PV-ESS or its licensors and is
        protected by intellectual property laws.
      </p>

      <h2 class="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
      <p class="mb-4">
        PV-ESS is not liable for any direct, indirect, incidental, or
        consequential damages arising from the use of our services.
      </p>

      <h2 class="text-xl font-semibold mb-2">6. Changes to Terms</h2>
      <p class="mb-4">
        We reserve the right to modify these Terms and Conditions at any time.
        Changes will be posted on our website and take effect immediately upon
        publication.
      </p>

      <h2 class="text-xl font-semibold mb-2">7. Governing Law</h2>
      <p class="mb-4">
        These Terms and Conditions shall be governed by and construed in
        accordance with the laws of [Jurisdiction].
      </p>

      <p>For any questions, please contact us at [Contact Information].</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold mb-6">PV-ESS 使用條款與條件</h1>
      <p class="mb-4">最近更新日期：[日期]</p>

      <p class="mb-6">
        歡迎使用
        PV-ESS。當您訪問或使用我們的服務時，即表示您同意遵守以下使用條款與條件。在使用本平台前，請務必仔細閱讀。
      </p>

      <h2 class="text-xl font-semibold mb-2">1. 條款接受</h2>
      <p class="mb-4">
        使用 PV-ESS
        即表示您已閱讀、理解並同意本使用條款。如果您不同意，請勿使用我們的服務。
      </p>

      <h2 class="text-xl font-semibold mb-2">2. 服務範圍</h2>
      <p class="mb-4">
        PV-ESS
        提供能源儲存解決方案及相關服務。我們保留隨時修改或終止服務的權利，恕不另行通知。
      </p>

      <h2 class="text-xl font-semibold mb-2">3. 使用者責任</h2>
      <ul class="list-disc pl-8 mb-4">
        <li>註冊時，使用者需提供準確完整的資訊。</li>
        <li>嚴禁未經授權使用本平台。</li>
        <li>使用者須負責維護帳戶憑據的機密性。</li>
      </ul>

      <h2 class="text-xl font-semibold mb-2">4. 智慧財產權</h2>
      <p class="mb-4">
        PV-ESS 平台上的所有內容，包括但不限於文字、圖形、標誌和軟體，均屬於
        PV-ESS 或其授權方，並受智慧財產權法律保護。
      </p>

      <h2 class="text-xl font-semibold mb-2">5. 責任限制</h2>
      <p class="mb-4">
        PV-ESS 對於因使用本服務而產生的任何直接、間接、附帶或衍生損害概不負責。
      </p>

      <h2 class="text-xl font-semibold mb-2">6. 條款變更</h2>
      <p class="mb-4">
        我們保留隨時修改本使用條款的權利。更改內容將公佈於網站上，並自發布後立即生效。
      </p>

      <h2 class="text-xl font-semibold mb-2">7. 法律適用</h2>
      <p class="mb-4">本使用條款受 [司法管轄區] 的法律管轄並按其解釋。</p>

      <p>如有任何疑問，請聯繫我們：[聯繫方式]。</p>
    </div>
  </div>
</template>
