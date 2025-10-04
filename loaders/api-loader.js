import { fetch } from "undici";

const headersOpt = {
  apikey: process.env.DB,
  Authorization: `Bearer ${process.env.DB}`,
  "Content-Type": "application/json",
  Accept: "application/json",
  "Content-Profile": "public",
  "Accept-Profile": "public",
  "User-Agent": "CSS Bot",
};

export async function get_status(plugin_arg, license) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/get_status",
    {
      method: "POST",
      headers: headersOpt,
      body: JSON.stringify({
        plugin: plugin_arg,
        license_arg: license,
      }),
    }
  );

  const json = await response.json();

  return json.get_license_status;
}

export async function get_license(plugin_arg, network_id) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/get_license_wrapper",
    {
      method: "POST",
      headers: {
        apikey: process.env.DB,
        Authorization: `Bearer ${process.env.DB}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Profile": "public",
        "Accept-Profile": "public",
      },
      body: JSON.stringify({
        plugin: plugin_arg,
        network_id_arg: network_id,
      }),
    }
  );

  const json = await response.json();

  return json.fetch_license_key;
}

export async function get_all(plugin_arg, license) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/get_all_wrapper",
    {
      method: "POST",
      headers: headersOpt,
      body: JSON.stringify({
        plugin: plugin_arg,
        license_arg: license,
      }),
    }
  );

  const json = await response.json();

  return json.get_all_json;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const key = "omCodepRiV";

function generateRandomString() {
  let length = 16;

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result.match(/.{4}/g).join("-").toString(); // dashed on every 4 character
}

function encryptString(inputString) {
  let encrypted = "";

  for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i) ^ key.charCodeAt(i % key.length);

    encrypted += charCode.toString(16);
  }

  return encrypted;
}

export function create_license(plugin) {
  return encryptString(plugin).concat("-" + generateRandomString());
}

export async function register_license(plugin_arg, key) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/register",
    {
      method: "POST",
      headers: headersOpt,
      body: JSON.stringify({
        plugin_name: plugin_arg,
        license_arg: key,
      }),
    }
  );

  const json = await response.json();

  return json.register_license;
}

export async function revoke_license(plugin_arg, license) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/revoke_license_wrapper",
    {
      method: "POST",
      headers: headersOpt,
      body: JSON.stringify({
        plugin: plugin_arg,
        license_arg: license,
      }),
    }
  );

  const json = await response.json();

  return json.revoke_license;
}

export async function update_value(
  plugin_arg,
  license_arg,
  key_arg,
  value_arg
) {
  const response = await fetch(
    "https://mxnuzxiklpdxrgapuusx.supabase.co/rest/v1/rpc/update_val",
    {
      method: "POST",
      headers: headersOpt,
      body: JSON.stringify({
        plugin: plugin_arg,
        license: license_arg,
        key: key_arg,
        value: value_arg,
      }),
    }
  );

  const json = await response.json();

  return json.update_table;
}

export async function getAllUsers() {
  

}