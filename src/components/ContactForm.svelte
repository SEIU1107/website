<script lang="ts">
  import { onMount } from "svelte";
  import HeadingTitle from "../components/HeadingTitle.svelte";
  import Quill from "quill";
  import Button from "./Button.svelte";
  import TextInput from "./Forms/TextInput.svelte";
  import FormDropdown from "./Forms/FormDropdown.svelte";

  // Inputs
  let nameInputValue = "";
  let emailInputValue = "";
  let phoneInputValue = "";
  let employerInputValue = "";

  // Error Messages
  let errorMessage = false;
  let nameMissing = false;
  let emailMissing = false;
  let emailInvalid = false;
  let phoneMissing = false;
  let messageMissing = false;

  // https://quilljs.com/
  let quill: Quill;
  onMount(() => {
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
    return !errorMessage;
  }

  function isValidEmail(email: string): boolean {
    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const formLabelStyling = "block mb-2 text-lg text-honey-flower-900 font-bold";
  const textInputStyling =
    "bg-gray-50 min-w-[90vw] md:min-w-72 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5";
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
        <FormDropdown
          update={(value: string) => {
            employerInputValue = value;
          }}
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
  </div>
  <div class="flex flex-col min-w-full max-w-screen-sm md:max-w-screen-md">
    <div class="mx-2.5 my-2.5">
      <div class={formLabelStyling.concat(" md:text-center")}>
        Message <span class="text-red-600">*</span>
      </div>
      <div class="bg-honey-flower-50">
        <div class="" id="editor"></div>
      </div>
      {#if messageMissing}
        <span class="text-red-600 text-sm">Message cannot be empty</span>
      {/if}
    </div>
  </div>
  <Button
    text="Submit"
    onClick={() => {
      console.log(quill.getSemanticHTML());
      console.log(quill.getLength());
      verifyFormSubmission();
    }}
  />
  {#if errorMessage}
    <div class="py-2 text-red-600">
      Please ensure all required (*) fields are filled out correctly before
      submitting.
    </div>
  {/if}
</div>
