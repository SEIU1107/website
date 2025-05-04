<script lang="ts">
  import { onMount } from "svelte";
  import HeadingTitle from "../HeadingTitle.svelte";
  import Quill, { Delta } from "quill";
  import Button from "../Button.svelte";
  import TextInput from "../Forms/TextInput.svelte";
  import DropdownInput from "../Forms/DropdownInput.svelte";
  import {
    formInputsStorageKey,
    saveContactFormInputs,
    contactFormStatusCodeKey,
    successToast,
    errorToast,
    warningToast,
  } from "../util";

  // Saved Inputs - Load them from local storage if they exist

  const savedInputs = JSON.parse(
    localStorage.getItem(formInputsStorageKey) || "{}"
  );

  const statusCode: number | null = JSON.parse(
    sessionStorage.getItem(contactFormStatusCodeKey) || "{}"
  ).statusCode;

  // Inputs
  let nameInputValue: string = savedInputs.nameInputValue || "";
  let emailInputValue: string = savedInputs.emailInputValue || "";
  let phoneInputValue: string = savedInputs.phoneInputValue || "";
  let employerInputValue: string = savedInputs.employerInputValue || "";
  let inquiryTypeInputValue: string =
    savedInputs.inquiryTypeInputValue || "General";

  // Quill likes to save rich text as a "Delta". We will use this for saved inputs
  // and re-entering them for when the user comes back.
  let messageDelta: Delta = savedInputs.messageDelta || "";

  // For sending to back end, but we use the Delta to save to localStorage
  // as Quill has no way of setting an initial value in the message box
  // off semantic HTML. We have to use the Delta form of the text.
  let messageSemanticHTML: string;

  // Error Messages
  let errorMessage = false;
  let nameMissing = false;
  let emailMissing = false;
  let emailInvalid = false;
  let phoneMissing = false;
  let messageMissing = false;

  // Styling Constants
  const formLabelStyling = "block mb-2 text-lg text-honey-flower-900 font-bold";
  const textInputStyling =
    "bg-gray-50 min-w-[90vw] md:min-w-72 border border-gray-300 text-black placeholder:text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5";

  // https://quilljs.com/
  let quill: Quill;

  // Keeps track of if the form was initialized
  let initialized = false;

  onMount(() => {
    // Create the Quill editor for the message box
    quill = new Quill("#editor", {
      placeholder: "Enter Message Here...",
      theme: "snow",

      // Determines what's allowed, in particular, NO LINKS!
      formats: ["bold", "italic", "underline", "header", "list", "strike"],

      // Defines the toolbar options
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
    });

    // Render saved message input if one exists (using Quill's Delta; there is no method for semantic HTML)
    quill.setContents(messageDelta);

    // Check for status code. The user is redirected here after a submission attempt.
    // Inform them on the status of the submission.
    console.log({ statusCode });
    switch (statusCode) {
      case 200:
        successToast("Message successfully sent!");
        break;
      case 400:
        warningToast(
          "The form was formatted incorrectly. Check your submission and try again."
        );
        break;
      case 404:
        errorToast(
          "The connection to the back end is broken; our team will fix it soon. Please try again later."
        );
        break;
      case 500:
        errorToast(
          "Server is broken; our team will fix it soon. Please try again later."
        );
        break;
    }

    // Remove sessionStorage info to prevent strange behavior with the confirmation page.
    sessionStorage.removeItem(formInputsStorageKey);
    sessionStorage.removeItem(contactFormStatusCodeKey);
    initialized = true;
  });

  function verifyFormSubmission(): boolean {
    // Returns true if the form was successfully filled out
    // Otherwise, sets the proper error messages to true.

    // Clear error messages
    errorMessage = false;
    nameMissing = false;
    emailMissing = false;
    emailInvalid = false;
    phoneMissing = false;
    messageMissing = false;

    // Check required fields are satisfied

    // Name
    if (!nameInputValue) {
      errorMessage = true;
      nameMissing = true;
    }

    // Email
    if (!emailInputValue) {
      errorMessage = true;
      emailMissing = true;
    } else if (!isValidEmail(emailInputValue)) {
      errorMessage = true;
      emailInvalid = true;
    }

    // Phone
    if (!phoneInputValue) {
      errorMessage = true;
      phoneMissing = true;
    }

    // Message Text
    if (quill.getLength() <= 2) {
      errorMessage = true;
      messageMissing = true;
    }

    if (errorMessage) {
      errorToast(
        "Please ensure all required (*) fields are filled out correctly before submitting."
      );
    }
    return !errorMessage;
  }

  function isValidEmail(email: string): boolean {
    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function onSubmit() {
    if (verifyFormSubmission()) {
      // Save inputs to sessionStorage
      // This is more temporary and scoped only to the tab

      messageSemanticHTML = quill.getSemanticHTML();

      const inputsToSave = {
        nameInputValue,
        emailInputValue,
        phoneInputValue,
        employerInputValue,
        inquiryTypeInputValue,

        // Save semantic HTML of message now to send to back end
        messageSemanticHTML,
      };

      sessionStorage.setItem(
        formInputsStorageKey,
        JSON.stringify(inputsToSave)
      );

      window.location.href = "/contact_us/confirm";
    }
  }

  $: saveContactFormInputs(
    nameInputValue,
    emailInputValue,
    phoneInputValue,
    employerInputValue,
    inquiryTypeInputValue,
    messageDelta
  );
</script>

<div class="flex flex-col items-center m-auto py-2">
  <HeadingTitle text="Contact Us" />
  <div class="flex flex-col m-auto">
    <div class="md:py-1.5 flex flex-col md:flex-row">
      <div class="md:mr-1">
        <div class={formLabelStyling}>
          Name <span class="text-red-600">*</span>
        </div>
        <TextInput
          initialValue={nameInputValue}
          placeholder="Enter Name *"
          update={(value: string) => {
            nameInputValue = value;
          }}
          styling={textInputStyling}
        />
        {#if nameMissing}
          <span class="text-red-600 text-sm">Name is required.</span>
        {/if}
      </div>
      <div class="mt-2.5 md:my-0 md:ml-1">
        <div class={formLabelStyling}>
          Email <span class="text-red-600">*</span>
        </div>
        <TextInput
          initialValue={emailInputValue}
          placeholder="Enter Email *"
          update={(value: string) => {
            emailInputValue = value;
          }}
          styling={textInputStyling}
        />
        {#if emailMissing}
          <span class="text-red-600 text-sm">Email is required.</span>
        {:else if emailInvalid}
          <span class="text-red-600 text-sm"
            >Email is not correctly formatted.</span
          >
        {/if}
      </div>
    </div>
    <div class="py-2.5 flex flex-col md:flex-row">
      <div class="md:mr-1">
        <div class={formLabelStyling}>
          Phone Number <span class="text-red-600">*</span>
        </div>
        <TextInput
          initialValue={phoneInputValue}
          placeholder="Enter Phone Number *"
          update={(value: string) => {
            phoneInputValue = value;
          }}
          styling={textInputStyling}
        />
        {#if phoneMissing}
          <span class="text-red-600 text-sm">Phone Number is required.</span>
        {/if}
      </div>
      <div class="my-2.5 md:my-0 md:ml-1">
        <div class={formLabelStyling}>Employer</div>
        <DropdownInput
          initialValue={employerInputValue}
          update={(value: string) => {
            employerInputValue = value;
          }}
          minWidth="min-w-[90vw] md:min-w-72"
          dropdownOptions={[
            "N/A",
            "Clark County",
            "LVCVA",
            "RTC",
            "SNHD",
            "SNRHA",
            "St. Rose",
            "Sunrise",
            "UMC",
            "WRD",
            "Southern Hills",
            "Renown",
            "Mountain View",
          ]}
        />
      </div>
    </div>
    <div>
      <div class={formLabelStyling}>Purpose of Inquiry</div>
      <DropdownInput
        initialValue={inquiryTypeInputValue}
        update={(value: string) => {
          inquiryTypeInputValue = value;
        }}
        minWidth="min-w-[90vw] md:min-w-72"
        dropdownOptions={[
          "General",
          "Representation and Collective Bargaining Agreements",
          "Organizing and Membership",
          "Media Inquiries",
          "Political and Community Organizing",
          "Administration and Human Resources",
          "Election Committee",
        ]}
      />
    </div>
  </div>
  <div class="flex flex-col min-w-full max-w-screen-sm md:max-w-screen-md">
    <div class="mx-2.5 my-2.5">
      <div class={formLabelStyling}>
        Message <span class="text-red-600">*</span>
      </div>
      <div class="bg-honey-flower-50">
        <div
          oninput={() => {
            // Need to set both the semantic HTML for sending to the back end,
            // as well as the Delta form of the message for saving into local storage
            messageSemanticHTML = quill.getSemanticHTML();
            messageDelta = quill.getContents();
          }}
          class=""
          id="editor"
        ></div>
      </div>
      {#if messageMissing}
        <span class="text-red-600 text-sm">Message cannot be empty.</span>
      {/if}
    </div>
  </div>
  <Button text="Submit" onClick={onSubmit} />
</div>
