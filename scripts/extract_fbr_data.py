import pandas as pd
import json
import os

excel_file = 'E:/difbr/st return sample.xlsm'
output_file = 'E:/difbr/get-legal-crm/src/lib/fbrReferences.json'

print("Loading Excel file...")
# Read REFERENCES sheet (header is on row 2, which is index 2 if skipping top metadata, but let's read without headers and find it)
df = pd.read_excel(excel_file, sheet_name='REFERENCES', header=None)

# Let's locate the row that contains "Item Sr. No." to set as headers
header_idx = -1
for i, row in df.iterrows():
    row_list = row.dropna().astype(str).tolist()
    if any('Item Sr. No.' in cell for cell in row_list):
        header_idx = i
        break

if header_idx != -1:
    df = pd.read_excel(excel_file, sheet_name='REFERENCES', header=header_idx)
else:
    print("Could not find headers, assuming row 2")
    df = pd.read_excel(excel_file, sheet_name='REFERENCES', header=2)

# Clean up column names (strip whitespace)
df.columns = [str(c).strip() for c in df.columns]

def get_clean_list(col_name):
    if col_name in df.columns:
        # Dropna and convert to string, then unique, and filter out empty strings
        vals = df[col_name].dropna().astype(str).str.strip().unique()
        return [v for v in vals if v]
    return []

print("Extracting columns...")
data = {
    "itemSrNos": get_clean_list("Item Sr. No."),
    "sros": get_clean_list("SRO"),
    "documentTypes": get_clean_list("Document Type"),
    "uoms": get_clean_list("UOM"),
    "provinces": get_clean_list("Province"),
    "buyerTypes": get_clean_list("Buyer Type"),
    "saleTypes": get_clean_list("Sale Types"),
    "rates": get_clean_list("Rate"),
    "descriptions": get_clean_list("Description"),
    "petroleumLevyOn": get_clean_list("Petroleum Levy on")
}

# The HS Codes are part of 'Description', e.g. "0101.2100:-  Horses Pure-bred breeding animals"
hs_codes = []
for desc in data["descriptions"]:
    parts = desc.split(":-", 1)
    if len(parts) == 2:
        hs_codes.append({
            "code": parts[0].strip(),
            "description": parts[1].strip(),
            "raw": desc
        })
    else:
        hs_codes.append({
            "code": "N/A",
            "description": desc,
            "raw": desc
        })

data["hsCodes"] = hs_codes

print(f"Extracted {len(hs_codes)} HS Codes.")
print(f"Extracted {len(data['saleTypes'])} Sale Types.")

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Extraction complete. Saved to", output_file)
