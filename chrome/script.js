var menuId = chrome.contextMenus.create({
  title: "AppSec=*",
  id: "parent",
  contexts: [ "selection" ],
  onclick: main,
})

const cve_urls = {
  nvd: `https://nvd.nist.gov/vuln/search/results?query=`,
  mitre: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=`,
  snyk: `https://security.snyk.io/vuln/?search=`,
  vulners: `https://vulners.com/search?query=`,
  sploitus: `https://sploitus.com/?query=`,
  exploitdb: `https://www.exploit-db.com/?q=`,
  cve: `https://www.cve.org/CVERecord?id=`,
  dorked: `https://www.google.com/search?q=`
};

const package_urls = {
  dorked: `https://www.google.com/search?q=`, // Removed Github b/c I was getting rate limited off rip and fuck em.
  ironbank:`https://ironbank.dso.mil/repomap?searchText=`
};

function main(info, tab)
{
	// Get highlighted text:
	var SEARCH = info.selectionText;

	// Replace "[dot]" with ".":
	SEARCH = SEARCH.replace(/\[dot\]/g, '.');

	// Remove quotes & brackets:
	SEARCH = SEARCH.replace(/[\"\'\[\]]/g, '');

	// Regex check if SEARCH is a CVE Number:
	var isCVE = !SEARCH.search(/CVE-\d{4}-\d{4,7}/);

  // Regex check if SEARCH is anything but a CVE Number:
  var isSoftware = !SEARCH.search(/^(?!.*CVE-\d{4}-\d{4,7}).+$/);

  // Search CVE sources:
  if (isCVE) 
  { 
    // Var Dec:
    var urls = [];
    var keys = ['nvd', 'mitre', 'snyk', 'vulners', 'sploitus', 'exploitdb', 'dorked', 'cve'];
    
    // Set URL Searches:
    for (var i = 0; i < keys.length; i++)
    {
      if (keys[i] === 'dorked') {urls.push(cve_urls[keys[i]] + SEARCH + "+(patch+OR+fix+OR+bug+OR+resolved+OR+solution)");}
      else {urls.push(cve_urls[keys[i]] + SEARCH);}
    }
    
    // Open URLS in new Chrome Incog Window:
    chrome.windows.create({
        url: urls,
        incognito: true, 
      });
  }

  // Search Open Source: (Assume Searching FOSS/MOTS)
	else 
  { 
    // Var Dec:
    var urls = [];
    var keys = ['ironbank', 'dorked'];
    var dork_site = ['github.com', 'hub.docker.com', 'pkg.go.dev', 'pypi.org', 'rpm.org', 'npmjs.com', 'jspm.io', 'crates.io', 'conan.io']

    // Replace " " with +:
    SEARCH = SEARCH.replace(/ /g, '+');
    
    // Set URL Searches:
    for (var i = 0; i < keys.length; i++)
    {
      if (keys[i] === 'dorked') 
      {
        for (var j = 0; j < dork_site.length; j++){urls.push(package_urls[keys[i]] + SEARCH + "+site%3A\""+dork_site[j]+"\"");}
      }
      else {urls.push(package_urls[keys[i]] + SEARCH);} // IB
    }
    
    // Open URLS in new Chrome Window:
    chrome.windows.create({
      url: urls,
      incognito: false,
    });
	}
}
