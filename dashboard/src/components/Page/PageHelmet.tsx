import { CustomBreadcrumbs } from "@canmingir/link/minimal/components";
import { Helmet } from "react-helmet-async";
import config from "../../../config";

function PageHelmet({ name, links }) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {config.name} - {name}
        </title>
      </Helmet>
      {Array.isArray(links) && links.length > 0 && (
        <CustomBreadcrumbs
          heading={name}
          links={links}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      )}
    </>
  );
}

export default PageHelmet;
