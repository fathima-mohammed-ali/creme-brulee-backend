import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

function paginator(items, current_page, per_page_items) {
  let page = current_page || 1,
    per_page = per_page_items,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page_items),
    total_pages = Math.ceil(items.length / per_page);
  console.log("Anzahl: " + items.lgenth);

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}

export default function AlignItemsList() {
  const carrierDetails = [
    {
      About: "Voralberg"
    },

    {
      About: "Tirol"
    },

    {
      About: "Salzburg "
    },
    {
      About: "Oberösterreich"
    },

    {
      About: "Niederösterreich"
    },

    {
      About: "Wien "
    },
    {
      About: "Burgenland"
    },

    {
      About: "Steiermark"
    },

    {
      About: "Kärnten "
    }
  ];

  const count = Math.ceil(carrierDetails.length / 3);
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(paginator(carrierDetails, value, 3).page);
  };
  const [checked, setChecked] = React.useState([]);
  const handleOnChange = (e, index) => {
    let prev = checked;
    let itemIndex = prev.indexOf(index);
    if (itemIndex !== -1) {
      prev.splice(itemIndex, 1);
    } else {
      prev.push(index);
    }
    setChecked([...prev]);
  };
  console.log(checked);

  return (
    <Container fixed>
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: "100rem",
            bgcolor: "background.paper"
          }}
        >
          {paginator(carrierDetails, page, 3).data.map((value, index) => {
            return (
              <ListItem
                alignItems="flex-start"
                divider={index < carrierDetails.length - 1}
              >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={value.carrierName}
                  secondary={
                    <React.Fragment>
                      <Stack direction="column" spacing={1}>
                        <div>
                          <b>Name</b> {value.About}
                        </div>
                      </Stack>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={count}
            page={page}
            onChange={handleChange}
            color="success"
          />
        </div>
      </div>
    </Container>
  );
}
