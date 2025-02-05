const augurAPI = require("../helpers/augurAPI");
const mailer = require("../helpers/mailer");
const { saveRepo } = require("../database/dblogic");

const bronzeBadge = async (name, email, id, url, content, DEICommitSHA) => {
  // Check for specific titles
  const titlesToCheck = [
    "Project Access",
    "Communication Transparency",
    "Newcomer Experiences",
    "Inclusive Leadership",
  ];
  const results = []; // capture the missing titles

  let hasAllTitles = true;

  for (const title of titlesToCheck) {
    if (!content.includes(title)) {
      results.push(`${title} is missing`);
      hasAllTitles = false;
    }
  }

  if (!hasAllTitles) {
    mailer(email, name, "Bronze", null, null, results.join("\n"));
  } else if (hasAllTitles) {
    // email content
    const markdownLink =
      "![Bronze Badge](https://raw.githubusercontent.com/AllInOpenSource/BadgingAPI/main/assets/bronze-badge.svg)";
    const htmlLink =
      "&lt;img src=&quot;https://raw.githubusercontent.com/AllInOpenSource/BadgingAPI/main/assets/bronze-badge.svg&quot; alt=&quot;DEI Badging Bronze Badge&quot; /&gt;";

    // send email
    mailer(email, name, "Bronze", markdownLink, htmlLink);

    // save repo to database and return repo id
    const repo_id = await saveRepo(
      id,
      DEICommitSHA,
      url,
      "Bronze",
      markdownLink,
      name
    );

    // use repo id in augur api call
    const { status } = await augurAPI(repo_id, "bronze", url);
    console.log(status);
  }
};

module.exports = bronzeBadge;
