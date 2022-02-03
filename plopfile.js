export default function(plop) {
  // create your generators here
  plop.setGenerator("component", {
    description: "To create a new component",
    prompts: [{
      type: "input",
      name: "name",
      message: "Please give a name to your new component"
    }], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "components/{{kebabCase name}}.vue",
        templateFile: "plop-templates/vue-component.hbs"
      }
    ]// array of actions
  });

  plop.setGenerator("project", {
    description: "To create a new project",
    prompts: [{
      type: "input",
      name: "projectName",
      message: "Please give a name to your new project"
    }], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "content/projects/{{kebabCase projectName}}.md",
        templateFile: "plop-templates/base-project.hbs"
      }
    ]// array of actions
  });
};
