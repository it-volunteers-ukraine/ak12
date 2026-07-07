const adminBase = "/management-console-12ak";

export const routes = {
  general: {
    home: "/",
  },
  admin: {
    home: adminBase,
    contacts: `${adminBase}/contacts`,
    contactsMenu: {
      header: `${adminBase}/contacts/header`,
      footer: `${adminBase}/contacts/footer`,
    },
  },
};
