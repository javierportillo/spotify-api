export default (policyContext, config, { strapi }) => {
  return !!policyContext.state?.user?.accessToken;
};
