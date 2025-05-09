<script lang="ts">
  import { onMount } from "svelte";
  import {
    formInputsStorageKey,
    contactFormStatusCodeKey,
    errorToast,
    warningToast,
  } from "../util";
  import Button from "../Button.svelte";
  import MailOutlined from "svelte-ant-design-icons/MailOutlined.svelte";
  let confirmationData: {
    nameInputValue: string;
    emailInputValue: string;
    phoneInputValue: string;
    employerInputValue: string;
    inquiryTypeInputValue: string;
    messageSemanticHTML: string;
  } | null = null;

  async function submitToBackend() {
    warningToast("Sending Message, please wait...");
    try {
      const requestBody = {
        name: confirmationData?.nameInputValue,
        email: confirmationData?.emailInputValue,
        phone: confirmationData?.phoneInputValue,
        employer: confirmationData?.employerInputValue,
        message: confirmationData?.messageSemanticHTML,
        inquiry: confirmationData?.inquiryTypeInputValue,
      };

      if (import.meta.env.DEV) {
        console.log(
          "submitToBackend() called. Contact form status code will use dummy response."
        );
        console.log({ requestBody });
      }

      const response = import.meta.env.DEV
        ? { status: 200 }
        : await fetch(import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

      const statusCode = response.status;
      if (statusCode === 200) {
        // Successful submission, we can remove the data from storage now
        localStorage.removeItem(formInputsStorageKey);
        sessionStorage.removeItem(formInputsStorageKey);
      }

      sessionStorage.setItem(
        contactFormStatusCodeKey,
        JSON.stringify({ statusCode })
      );

      window.location.href = "/contact_us";
    } catch (error) {
      console.error("Error while submitting form:", error);
      errorToast(
        "Website connection to back end is broken. It is currently undergoing maintenance. Please try again later."
      );
    }
  }
  contactFormStatusCodeKey;

  onMount(() => {
    const storedData = sessionStorage.getItem(formInputsStorageKey);
    if (storedData) {
      confirmationData = JSON.parse(storedData);
    } else {
      window.location.href = "/contact_us";
    }
  });
</script>

<div
  class="max-w-[90vw] bg-white p-5 m-3 rounded-md shadow-sm shadow-black flex flex-col"
>
  <h2 class="text-center text-black font-bold mb-2">
    Please confirm the following information before submitting.
  </h2>
  <ul class="font-Roboto text-md">
    <li><b>Name: </b> {confirmationData?.nameInputValue}</li>
    <li><b>Phone: </b> {confirmationData?.phoneInputValue}</li>
    <li><b>Email: </b> {confirmationData?.emailInputValue}</li>
    <li><b>Employer: </b> {confirmationData?.employerInputValue}</li>
    <li>
      <b>Purpose of Inquiry: </b>
      {confirmationData?.inquiryTypeInputValue}
    </li>
  </ul>
  <hr class="my-2.5 bg-black" />
  <div class="prose text-sm">
    {@html confirmationData?.messageSemanticHTML}
  </div>
  <div class="m-auto flex flex-row">
    <div class="mr-1">
      <Button href="/contact_us">
        <div class="flex flex-row items-center">
          <span class="px-2">&larr;</span> Edit Submission
        </div>
      </Button>
    </div>
    <div class="ml-1">
      <Button
        onClick={() => {
          submitToBackend();
        }}
      >
        <div class="flex flex-row items-center">
          <MailOutlined />
          <span class="pl-2">Submit</span>
        </div>
      </Button>
    </div>
  </div>
</div>
