export const validateUser = (options) => {
  const numberPattern = /^[0-9]+$/;

  if (options.email && !options.email.includes("@")) {
    return {
      __typename: "Errors",
      message: "must use a valid email",
    };
  }

  if (options.password && options.password.length <= 2) {
    return {
      __typename: "Errors",
      message: "password length must be greater than 2",
    };
  }

  if (options.phone) {
    if (options.phone.length !== 10) {
      return {
        __typename: "Errors",
        message: "phone number must be exactly 10 digits",
      };
    }
    if (!numberPattern.test(options.phone)) {
      return {
        __typename: "Errors",
        message: "phone number must contain only digits",
      };
    }
  }

  return null;
};

export const validateChannel = (options) => {
  const channelNamePattern = /^[A-Za-z0-9_@./#&+-\s]{1,35}$/;

  if (options.name.length < 1) {
    return {
      __typename: "Errors",
      message: "channel name cannot be empty",
    };
  }

  if (!channelNamePattern.test(options.name)) {
    return {
      __typename: "Errors",
      message:
        "channel name must be less than 35 characters in length and contain only alphanumeric characters",
    };
  }

  if (options.description.length < 1) {
    return {
      __typename: "Errors",
      message: "channel description cannot be empty",
    };
  }

  return null;
};
