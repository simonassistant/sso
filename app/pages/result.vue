<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
    <div class="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <!-- Header -->
      <div class="bg-[#005aab] p-6 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Login Successful</h1>
        <p class="text-blue-100 text-sm mt-1">Welcome to the AI Tutor platform</p>
      </div>

      <!-- Content -->
      <div class="p-8">
        <div v-if="userInfo" class="space-y-6">
          <div class="grid grid-cols-1 gap-y-4">
            <div v-for="(value, label) in displayFields" :key="label" class="flex flex-col border-b border-slate-50 pb-3 last:border-0">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ label }}</span>
              <span class="text-slate-700 font-medium mt-1">{{ value || 'N/A' }}</span>
            </div>
          </div>
          
          <div class="pt-4">
            <NuxtLink 
              to="/" 
              class="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#005aab] bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-slate-600 font-medium">No user information found.</p>
          <p class="text-slate-400 text-sm mt-1">Please try logging in again to access your account.</p>
          <NuxtLink 
            to="/" 
            class="mt-6 inline-flex items-center text-sm font-semibold text-[#005aab] hover:underline"
          >
            Return to Login
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div class="mt-8 text-slate-400 text-sm">
      &copy; {{ new Date().getFullYear() }} HKBU AI Tutor Project
    </div>
  </div>
</template>

<script setup>
const userInfoCookie = useCookie('user_info')
const userInfo = computed(() => userInfoCookie.value)

const displayFields = computed(() => {
  if (!userInfo.value) return {}
  return {
    'SSO ID': userInfo.value.ssoid,
    'Full Name': userInfo.value.full_name,
    'Email Address': userInfo.value.email,
    'Employee Type': userInfo.value.employee_type,
    'Department Code': userInfo.value.dept_unit_code
  }
})
</script>
