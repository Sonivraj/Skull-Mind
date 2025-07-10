<?php
$subject = 'E-mail From Skullmind.work';
$to = 'madart@outlook.com';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: Skullmind <madart@outlook.com>\r\n";

$message = '';

function sanitize($input)
{
  return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

if (!empty($_POST["name"])) {
  $message .= 'Name: ' . sanitize($_POST['name']) . '<br/>';
}
if (!empty($_POST["email"]) && filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
  $message .= 'Email: ' . sanitize($_POST['email']) . '<br/>';
}
if (!empty($_POST["phone"])) {
  $message .= 'Phone: ' . sanitize($_POST['phone']) . '<br/>';
}
if (!empty($_POST["website"])) {
  $message .= 'Website: ' . sanitize($_POST['website']) . '<br/>';
}
if (!empty($_POST["message"])) {
  $message .= 'Message: ' . sanitize($_POST['message']) . '<br/>';
}

if (!empty($message)) {
  if (@mail($to, $subject, $message, $headers)) {
    echo 'sent';
  } else {
    echo 'failed';
  }
} else {
  echo 'empty';
}
?>