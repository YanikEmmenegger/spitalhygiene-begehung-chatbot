# Use the official Nginx image as the base
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d

# Expose the required ports
EXPOSE 80 443
