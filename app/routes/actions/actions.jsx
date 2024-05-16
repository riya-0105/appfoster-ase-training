import db from '../../db.server.js';

export async function action({request}) {
    let msg = '';
    let title = '';
    let msgModal = false;
    const formData = await request.formData();
  
    // action delete -> delete particular row
    
    if(formData.get('action') == 'delete') {
      const deleteRow = formData.get('row');
      console.log(deleteRow);
  
      try {
        await db.orderLimit.delete({
          where: {
            id: Number(deleteRow)
          }
        })
        title = "Success";
        msg = "Deleted Sucessfully";
        console.log("Delete Successful");
      }
      catch(err) {
        title = "Error";
        msg = err;
        console.log("Delete Unsuccessful")
      }
    }
  
    // edit field action
  
    else if(formData.get('action') == 'edit') {
      // for store wise
  
      if(formData.get('limit_type') === 'store wise') {
        try {
          await db.orderLimit.update({
            where: {
              id: Number(formData.get('id')) 
            },
            data: {
              limit_quantity: formData.get("limit_quantity"),
              limit_status: formData.get('status')
            }
          });
          title = "Success";
          msg = "Updated Successfully";
        }
        catch(error) {
          title = "Error";
          msg = error;
        }
      }
  
      // product wise
      else if(formData.get('limit_type') == 'product wise') {
        try {
          await db.orderLimit.update({
            where: {
              id: Number(formData.get('id')) 
            },
            data: {
              limit_quantity: formData.get('limit_quantity'),
              type_id: formData.get('type_id'),
              limit_status: formData.get('status')
            }
          });
          title = "Success";
          msg = "Updated Successfully";
        }
        catch(error) {
          title = "Error";
          msg = error;
        }
      }
  
      // category wise
      else if(formData.get('limit_type') == 'category wise') {
        try {
          await db.orderLimit.update({
            where: {
              id: Number(formData.get('id')) 
            },
            data: {
              limit_quantity: formData.get('limit_quantity'),
              type_id: formData.get('type_id'),
              limit_status: formData.get('status')
            }
          });
          title = "Success";
          msg = "Updated Successfully";
        }
        catch(error) {  
          title = 'Error';
          msg = error;
        }
      }
    }
  
    //  create new type
  
    else {
      let productId = null;
      let value = 0;
      const selected = formData.get('selected');
      const formState = formData.get('type_id');
      const statusState = formData.get('status');
      const productCount = formData.get('limit_quantity');
      console.log("the status is ", statusState);
      // const loaderResult = await loader(formState);
      console.log("the form data is ", formState);
      console.log(selected);
      console.log(formState);
  
      // store wise
  
      if(formData.get('selected') === 'store wise') {
        const existingRecord = await db.orderLimit.findFirst({
          where: {
            limit_type: 'store wise'
          }
        });
        if(!existingRecord) {
          const data = {limit_type: formData.get('selected'), limit_status: formData.get('status'), limit_quantity: String(formData.get('limit_quantity'))}
          try {
            await db.orderLimit.create({data});
            title = "Success";
            msg = 'Successfully Created!!!';
          }
          catch(error) {
            title = "Error";
            msg = error;
          }
        }
        else {
          title = "Error";
          msg = "Item already Existed!!!";
        }
      }
  
      // product wise create
  
      else if(formData.get('selected') === 'product wise') {
        const existingRecord = await db.orderLimit.findFirst({
          where: {
            type_id: formData.get('type_id')
          }
        });
        if(!existingRecord) {
          const data = {limit_type: formData.get('selected'), type_id: formData.get('type_id'), limit_status: formData.get('status'), limit_quantity: String(formData.get('limit_quantity'))};
          try {
            await db.orderLimit.create({data});
            title = "Success";
            msg = "Successfully Created!!!";
          }
          catch(error) {
            title = "Error";
            msg = error;
          }
        }
        else {
          title = "Error";
          msg = 'Item already existed in Database!!!';
        }
      }
  
      // category wise 
      
      else if(selected === 'category wise') {
        const existingRecord = await db.orderLimit.findFirst({
          where: {
            type_id: formData.get('type_id')
          }
        });
        if(!existingRecord) {
          const data = {limit_type: formData.get('selected'), type_id: formData.get('type_id'), limit_status: formData.get('status'), limit_quantity: String(formData.get('limit_quantity'))};
          try {
            await db.orderLimit.create({data});
            title = "Success";
            msg = 'Successfully Created!!!';
          }
          catch(error) {
            title = "Error";
            msg = error;
          }
        }
        else {
          title = "Error";
          msg = 'Item already existed in Database!!!';
        }
      }
    }

    msgModal = true;
    let activeModal = false;
    console.log("the msg is: ", msg);
    await metaFunction(request);
    return { msg, msgModal, title, activeModal };
}