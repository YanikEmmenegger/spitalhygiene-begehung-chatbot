// swaggerYaml.ts

export const swaggerYaml = `
openapi: "3.0.3"
info:
  version: "1.0.0"
  title: "Begehungstool API"

tags:
  - name: "Auth"
    description: "Authentication / Admin routes"
  - name: "Category"
    description: "Managing categories"
  - name: "Subcategory"
    description: "Managing subcategories"
  - name: "Department"
    description: "Managing departments"
  - name: "Department-Question"
    description: "Relationships between departments and questions"
  - name: "Person Types"
    description: "Managing person types"
  - name: "Question"
    description: "Managing questions"
  - name: "Review"
    description: "Endpoints for finalizing/sending reviews"

paths:
  /api/auth/admin:
    get:
      tags:
        - "Auth"
      summary: "Check if logged-in user is an admin."
      description: >
        Checks whether the currently authenticated user is in the 'admin_users' table.  
        Returns \`isAdmin = true\` if so, otherwise \`false\`.
      responses:
        '200':
          description: "Returns JSON indicating admin status."
          content:
            application/json:
              schema:
                type: object
                properties:
                  isAdmin:
                    type: boolean
        '401':
          description: "Unauthorized if not logged in or user not found."
        '500':
          description: "Internal server error during checks."

  /api/auth/confirm:
    get:
      tags:
        - "Auth"
      summary: "Confirm Supabase OTP or Magic Link."
      description: >
        Verifies an OTP or token-hash from a magic link.  
        If successful, sets a session cookie or returns status 200.
      parameters:
        - name: token_hash
          in: query
          required: false
          schema:
            type: string
        - name: type
          in: query
          required: true
          schema:
            type: string
          description: "Supabase EmailOtpType"
        - name: token
          in: query
          required: false
          schema:
            type: string
        - name: email
          in: query
          required: false
          schema:
            type: string
      responses:
        '200':
          description: "Success. Either returns JSON or redirects."
        '401':
          description: "OTP verification failed or invalid parameters."
        '500':
          description: "Unexpected error."

  /api/auth/signout:
    post:
      tags:
        - "Auth"
      summary: "Sign out user."
      description: >
        Signs the user out of Supabase, clears relevant cookies, and redirects to \`/login\`.
      responses:
        '302':
          description: "Redirect to /login."
        '401':
          description: "If no user session is found, also redirects."

  /api/category:
    get:
      tags:
        - "Category"
      summary: "List all categories."
      description: >
        Returns all categories sorted by \`priority\` ascending.
      responses:
        '200':
          description: "A JSON array of Category objects."
        '500':
          description: "Internal server error."

    post:
      tags:
        - "Category"
      summary: "Create a new Category."
      description: >
        Requires admin permission. Expects a JSON body with \`name\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
              required: [name]
      responses:
        '201':
          description: "Category created successfully."
        '400':
          description: "Missing name."
        '401':
          description: "Unauthorized (not admin)."
        '500':
          description: "Error from database."

    delete:
      tags:
        - "Category"
      summary: "Delete a Category."
      description: >
        Requires admin permission. If the Category still has connected subcategories, the request is refused.
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
          description: "Category ID to delete."
      responses:
        '200':
          description: "Deletion successful."
        '400':
          description: "ID missing or category still has connections."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

    put:
      tags:
        - "Category"
      summary: "Update a Category."
      description: >
        Requires admin permission.  
        Expects a JSON body with \`id, name, priority\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: number
                name:
                  type: string
                priority:
                  type: number
              required: [id, name, priority]
      responses:
        '200':
          description: "Update successful."
        '400':
          description: "Validation error or missing required fields."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

  /api/subcategory:
    get:
      tags:
        - "Subcategory"
      summary: "List all subcategories."
      description: >
        Returns all subcategories sorted by \`priority\`, with their \`category\` data.  
        Also includes optional \`link_name\` and \`link_url\` fields if they exist.
      responses:
        '200':
          description: "A JSON array of Subcategory objects."
        '500':
          description: "Error in the database."

    post:
      tags:
        - "Subcategory"
      summary: "Create a new Subcategory."
      description: >
        Requires admin permission.  
        Body must have \`name, category\`.  
        Optionally can include \`priority, link_name, link_url\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                category:
                  type: number
                priority:
                  type: number
                link_name:
                  type: string
                link_url:
                  type: string
              required: [name, category]
      responses:
        '201':
          description: "Subcategory created."
        '400':
          description: "Missing fields or invalid."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

    delete:
      tags:
        - "Subcategory"
      summary: "Delete a Subcategory."
      description: >
        Requires admin permission.  
        If subcategory is still used by any questions, fails with 400.
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
          description: "Subcategory ID"
      responses:
        '200':
          description: "Deletion successful."
        '400':
          description: "Subcategory is connected to questions or ID missing."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

    put:
      tags:
        - "Subcategory"
      summary: "Update a Subcategory."
      description: >
        Requires admin permission.  
        Body must have \`id, name, category, priority\` and optionally \`link_name, link_url\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: number
                name:
                  type: string
                category:
                  type: number
                priority:
                  type: number
                link_name:
                  type: string
                link_url:
                  type: string
              required: [id, name, category, priority]
      responses:
        '200':
          description: "Update successful."
        '400':
          description: "Missing required fields or subcategory connected."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

  /api/departments:
    get:
      tags:
        - "Department"
      summary: "Retrieve departments."
      description: >
        If no query param \`id\`, returns all departments.  
        If \`?id=...\`, returns a single department by that ID.
      parameters:
        - name: id
          in: query
          required: false
          schema:
            type: string
          description: "Optional department ID"
      responses:
        '200':
          description: "Returns JSON of either a single department or an array of all."
        '500':
          description: "Database error."

    post:
      tags:
        - "Department"
      summary: "Create a new department."
      description: >
        Admin only. Requires a JSON body with \`{ name }\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
              required: [name]
      responses:
        '201':
          description: "Department created."
        '400':
          description: "Missing or invalid name."
        '401':
          description: "Unauthorized (not admin)."
        '500':
          description: "Database error."

    delete:
      tags:
        - "Department"
      summary: "Delete a department."
      description: >
        Admin only.  
        Fails if that department is still referenced in department_question.
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
          description: "Department ID"
      responses:
        '200':
          description: "Successfully deleted."
        '400':
          description: "Missing param or department is still connected."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

    put:
      tags:
        - "Department"
      summary: "Update a department."
      description: >
        Admin only.  
        Body must have \`{ id, name }\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: number
                name:
                  type: string
              required: [id, name]
      responses:
        '200':
          description: "Update success."
        '400':
          description: "Missing fields or invalid data."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

  /api/department_question:
    get:
      tags:
        - "Department-Question"
      summary: "List department-question connections."
      description: >
        Returns all entries in the \`department_question\` many-to-many relationship, as an array of \`(department_id, question_id)\` objects.
      responses:
        '200':
          description: "JSON array of all connections."
        '500':
          description: "Server error."

    post:
      tags:
        - "Department-Question"
      summary: "Add new Department → Question connection."
      description: >
        Admin only.  
        Body: \`{ "department_id": number, "question_id": number }\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                department_id:
                  type: number
                question_id:
                  type: number
              required: [department_id, question_id]
      responses:
        '201':
          description: "Connection created."
        '400':
          description: "Missing required fields."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

    delete:
      tags:
        - "Department-Question"
      summary: "Remove Department → Question connection."
      description: >
        Admin only.  
        Query params: \`?department_id=XXX&question_id=YYY\`.
      parameters:
        - name: department_id
          in: query
          required: true
          schema:
            type: string
        - name: question_id
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: "Deletion success."
        '400':
          description: "Missing param or invalid data."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

  /api/person_types:
    get:
      tags:
        - "Person Types"
      summary: "List all person types."
      description: >
        Returns all person types from \`person_types\` table.
      responses:
        '200':
          description: "JSON array of person types."
        '500':
          description: "Server error."

    post:
      tags:
        - "Person Types"
      summary: "Create a new person type."
      description: >
        Admin only.  
        Body must have \`{ name }\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
              required: [name]
      responses:
        '201':
          description: "Created person type."
        '400':
          description: "Missing name."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

    delete:
      tags:
        - "Person Types"
      summary: "Delete a person type."
      description: >
        Admin only.  
        Query param \`id=?\`.
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: "Deleted."
        '400':
          description: "Missing param or problem."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

    put:
      tags:
        - "Person Types"
      summary: "Update a person type."
      description: >
        Admin only.  
        Body must have \`{ id, name }\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: number
                name:
                  type: string
              required: [id, name]
      responses:
        '200':
          description: "Updated successfully."
        '400':
          description: "Missing or invalid data."
        '401':
          description: "Unauthorized."
        '500':
          description: "Server error."

  /api/questions:
    get:
      tags:
        - "Question"
      summary: "Fetch questions with optional filtering."
      description: >
        Returns question data, including subcategory/category details.  
        Accepts optional search by text, department filtering, ID filtering, or \`exclude\` IDs.  
        Sorts results by category.priority then subcategory.priority, then question.priority.
      parameters:
        - name: department
          in: query
          schema:
            type: string
          required: false
          description: "Department ID to return only connected questions."
        - name: exclude
          in: query
          schema:
            type: string
          required: false
          description: "Semicolon-separated list of question IDs to exclude."
        - name: search
          in: query
          schema:
            type: string
          required: false
          description: "Search string to match \`question\` text (case-insensitive)."
        - name: id
          in: query
          schema:
            type: string
          required: false
          description: "Fetch only a single question by ID."
      responses:
        '200':
          description: "JSON array of matching questions or a single question if \`id\` is used."
        '500':
          description: "Server error or invalid query."

    post:
      tags:
        - "Question"
      summary: "Create a new question."
      description: >
        Admin only.  
        Body must have \`question, subcategory\`.  
        Fields \`critical, type, priority, link_name, link_url\` are optional.  
        \`type\` can be \`'Beobachtung' | 'Frage Personal' | 'Frage ärztliches Personal' | 'nicht anwendbar'\`.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                question:
                  type: string
                  description: "The question text."
                critical:
                  type: boolean
                  default: false
                subcategory:
                  type: number
                  description: "Subcategory ID."
                type:
                  type: string
                  nullable: true
                  description: "One of the recognized question types."
                priority:
                  type: number
                  default: 0
                  description: "An integer priority for ordering."
                link_name:
                  type: string
                  nullable: true
                  description: "Optional link name for referencing external docs."
                link_url:
                  type: string
                  nullable: true
                  description: "Optional URL for referencing external docs."
              required: [question, subcategory]
      responses:
        '201':
          description: "Question created."
        '400':
          description: "Missing fields."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

    delete:
      tags:
        - "Question"
      summary: "Delete a question."
      description: >
        Admin only.  
        If question is connected to any department, fails with 400.
      parameters:
        - name: id
          in: query
          required: true
          schema:
            type: string
          description: "Question ID to delete."
      responses:
        '200':
          description: "Deleted successfully."
        '400':
          description: "Missing param or question still connected."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

    put:
      tags:
        - "Question"
      summary: "Update a question."
      description: >
        Admin only.  
        Body must have \`id, question, subcategory\`.  
        Fields \`critical, type, priority, link_name, link_url\` are optional to update.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: number
                  description: "Question ID to update."
                question:
                  type: string
                  description: "New question text."
                critical:
                  type: boolean
                  description: "Mark if critical."
                subcategory:
                  type: number
                  description: "Subcategory ID."
                type:
                  type: string
                  nullable: true
                  description: "One of [Beobachtung, Frage Personal, Frage ärztliches Personal, nicht anwendbar]."
                priority:
                  type: number
                  default: 0
                  description: "Priority for ordering."
                link_name:
                  type: string
                  nullable: true
                  description: "Optional name for an external link."
                link_url:
                  type: string
                  nullable: true
                  description: "Optional URL for external doc."
              required: [id, question, subcategory]
      responses:
        '200':
          description: "Successfully updated."
        '400':
          description: "Missing or invalid parameters."
        '401':
          description: "Unauthorized."
        '500':
          description: "Database error."

  /api/review/send:
    post:
      tags:
        - "Review"
      summary: "Send a completed review via email with a Word doc attached."
      description: >
        Must be logged in.  
        Body must have \`{ review }\` with \`review.status === "complete"\`.  
        Generates a Word document from the given review and emails it to the user.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                review:
                  type: object
                  description: "The completed review object"
      responses:
        '200':
          description: "Email sent with Word attachment."
        '400':
          description: "Invalid request: missing or incomplete review."
        '401':
          description: "No user session or unauthorized."
        '500':
          description: "Internal error generating or sending email."

components:
  securitySchemes:
    CookieAuth:
      type: http
      scheme: bearer
      description: >
        This API mostly uses Supabase JWT tokens or server sessions.  
        Some admin routes require checking the user is in the \`admin_users\` table.
`;
